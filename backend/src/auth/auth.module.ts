import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { RefreshSessionService } from './refresh-session/refresh-session.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshSessionEntity } from './refresh-session/refresh-session.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RefreshSessionService],
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([RefreshSessionEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
