import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Aedes, AedesPublishPacket, AuthenticateError, Client, PublishPacket, Subscription } from 'aedes';
import { createServer as createHttpServer, Server as HttpServer } from 'http';
import { createServer, Server } from 'net';
import { WebSocket, WebSocketServer } from 'ws';

@Injectable()
export class MqttBrokerService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(MqttBrokerService.name);
  private broker: Aedes;
  private tcpServer: Server;
  private wsHttpServer: HttpServer | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.start();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.stop();
  }

  private async start(): Promise<void> {
    const tcpPort = this.configService.get<number>('MQTT_PORT', 1883);
    const wsPort = this.configService.get<number>('MQTT_WS_PORT', 8083);
    const wsEnabled = this.configService.get<string>('MQTT_WS_ENABLED') === 'true';

    // v1.0 필수: createBroker()가 내부적으로 listen()을 호출해 persistence/heartbeat를 초기화함
    // drainTimeout=0: 쓰기 버퍼 지연으로 인한 강제 종료 방지 (기본 60s)
    this.broker = await Aedes.createBroker({
      connectTimeout: this.configService.get<number>('MQTT_CONNECT_TIMEOUT', 30000),
      heartbeatInterval: this.configService.get<number>('MQTT_HEARTBEAT_INTERVAL', 60000),
      drainTimeout: this.configService.get<number>('MQTT_DRAIN_TIMEOUT', 0),
    });

    this.setupAuthentication();
    this.registerEventHandlers();

    // TCP 서버
    this.tcpServer = createServer((socket) => this.broker.handle(socket));
    this.tcpServer.listen(tcpPort, () => {
      this.logger.log(`MQTT TCP Broker started on port ${tcpPort}`);
    });

    // WebSocket 서버 — 브라우저는 TCP를 사용할 수 없어 WS 필수
    // MQTT_WS_ENABLED=true 로 활성화 (기본 포트 8083)
    if (wsEnabled) {
      this.wsHttpServer = createHttpServer();
      const wsServer = new WebSocketServer({ server: this.wsHttpServer });
      wsServer.on('connection', (ws, req) => {
        // ws.WebSocket은 Duplex 스트림이 아니므로 createWebSocketStream()으로 변환 필요
        const stream = WebSocket.createWebSocketStream(ws);
        this.broker.handle(stream, req);
      });
      this.wsHttpServer.listen(wsPort, () => {
        this.logger.log(`MQTT WebSocket Broker started on port ${wsPort}`);
      });
    }
  }

  private setupAuthentication(): void {
    const username = this.configService.get<string>('MQTT_USERNAME');
    const password = this.configService.get<string>('MQTT_PASSWORD');

    if (!username) {
      return;
    }

    this.broker.authenticate = (
      _client: Client,
      incomingUsername: Readonly<string | undefined>,
      incomingPassword: Readonly<Buffer | undefined>,
      callback: (error: AuthenticateError | null, success: boolean | null) => void,
    ) => {
      const isValid = incomingUsername === username && incomingPassword?.toString() === password;

      if (!isValid) {
        const error = Object.assign(new Error('Bad username or password'), {
          returnCode: 4, // AuthErrorCode.BAD_USERNAME_OR_PASSWORD
        }) as AuthenticateError;
        return callback(error, false);
      }

      callback(null, true);
    };
  }

  private registerEventHandlers(): void {
    this.broker.on('client', (client: Client) => {
      this.logger.log(`[connect] clientId=${client.id}`);
    });

    this.broker.on('clientDisconnect', (client: Client) => {
      this.logger.log(`[disconnect] clientId=${client.id}`);
    });

    this.broker.on('subscribe', (subscriptions: Subscription[], client: Client) => {
      const topics = subscriptions.map((s) => s.topic).join(', ');
      this.logger.log(`[subscribe] clientId=${client.id} topics=${topics}`);
    });

    this.broker.on('unsubscribe', (unsubscriptions: string[], client: Client) => {
      this.logger.log(`[unsubscribe] clientId=${client.id} topics=${unsubscriptions.join(', ')}`);
    });

    this.broker.on('publish', (packet: AedesPublishPacket, client: Client | null) => {
      if (client) {
        this.logger.debug(`[publish] clientId=${client.id} topic=${packet.topic} payload=${packet.payload.toString()}`);
      }
    });

    this.broker.on('keepaliveTimeout', (client: Client) => {
      this.logger.warn(`[keepaliveTimeout] clientId=${client?.id ?? 'unknown'} — PINGREQ 미수신으로 연결 종료`);
    });

    this.broker.on('clientError', (client: Client, error: Error) => {
      this.logger.error(`[clientError] clientId=${client?.id ?? 'unknown'} message=${error.message}`);
    });

    this.broker.on('connectionError', (client: Client, error: Error) => {
      this.logger.error(`[connectionError] clientId=${client?.id ?? 'unknown'} message=${error.message}`);
    });
  }

  publish(topic: string, payload: string | Buffer, qos: 0 | 1 | 2 = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      const packet: PublishPacket = {
        cmd: 'publish',
        qos,
        topic,
        payload: typeof payload === 'string' ? Buffer.from(payload) : payload,
        retain: false,
        dup: false,
      };

      this.broker.publish(packet, (error?: Error) => {
        if (error) {
          this.logger.error(`[publish error] topic=${topic} message=${error.message}`);
          return reject(error);
        }
        resolve();
      });
    });
  }

  subscribe(
    topic: string,
    handler: (packet: AedesPublishPacket, done: () => void) => void,
  ): void {
    this.broker.subscribe(topic, handler, () => {
      this.logger.log(`[server subscribe] topic=${topic}`);
    });
  }

  unsubscribe(
    topic: string,
    handler: (packet: AedesPublishPacket, done: () => void) => void,
  ): void {
    this.broker.unsubscribe(topic, handler, () => {
      this.logger.log(`[server unsubscribe] topic=${topic}`);
    });
  }

  get connectedClients(): number {
    return this.broker.connectedClients;
  }

  private stop(): Promise<void> {
    return new Promise((resolve) => {
      const closeWs = (): Promise<void> => {
        if (!this.wsHttpServer) return Promise.resolve();
        return new Promise((res) => this.wsHttpServer!.close(() => res()));
      };

      this.broker.close(() => {
        this.tcpServer.close(async () => {
          await closeWs();
          this.logger.log('MQTT Broker stopped');
          resolve();
        });
      });
    });
  }
}
