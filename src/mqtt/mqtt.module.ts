import { Module } from '@nestjs/common';
import { MqttController } from './api/mqtt.controller';
import { MqttBrokerService } from './application/mqtt.broker.service';

@Module({
  controllers: [MqttController],
  providers: [MqttBrokerService],
  exports: [MqttBrokerService],
})
export class MqttModule {}
