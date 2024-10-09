import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserEntity } from '../entity/user.entity';
import {
  databaseDatabase,
  databaseHost,
  databaseLogging,
  databasePassword,
  databaseUsername,
} from '../common/domain/env.const';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow(databaseHost),
        port: +configService.getOrThrow<number>(databaseHost),
        username: configService.getOrThrow(databaseUsername),
        password: configService.getOrThrow(databasePassword),
        database: configService.getOrThrow(databaseDatabase),
        entities: [UserEntity],
        timezone: 'local',
        namingStrategy: new SnakeNamingStrategy(),
        logging: configService.get(databaseLogging) === 'true',
        synchronize: false,
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
})
export class DatabaseModule {}
