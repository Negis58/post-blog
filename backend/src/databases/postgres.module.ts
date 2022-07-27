import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import UserEntity from '../user/user.entity';
import { RefreshSessionEntity } from '../auth/refresh-session/refresh-session.entity';
import PostEntity from '../post/post.entity';
import { FileEntity } from '../files/file.entity';
import { TypeOrmLoggerContainer } from './typeorm-config/TypeOrmLoggerContainer';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [UserEntity, RefreshSessionEntity, PostEntity, FileEntity],
        synchronize: true,
        logging: true,
        logger: TypeOrmLoggerContainer.ForConnection('default', true),
      }),
    }),
  ],
})
export class PostgresModule {}
