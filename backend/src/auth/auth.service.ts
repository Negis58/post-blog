import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { UserService } from '../user/user.service';
import registerDto from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshSessionService } from './refresh-session/refresh-session.service';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private refreshSessionService: RefreshSessionService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async register(registerDto: registerDto) {
    const candidate = await this.userService.getUserByEmail(registerDto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await this.generatePasswordHash(registerDto.password);
    const user = await this.userService.createUser({
      ...registerDto,
      password: hashPassword,
    });
    const payload = { id: user.id, username: user.username };
    return await this.createPairTokens(payload);
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload = { id: user.id, username: user.username };
    return await this.createPairTokens(payload);
  }

  private async validateUser(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    console.log('user', user);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }
    const passwordEquals = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordEquals) {
      throw new HttpException('Неверный пароль', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async refreshToken(refreshToken: string) {
    const refreshSession = await this.refreshSessionService.checkRelevance(
      refreshToken,
    );
    const payload = {
      id: refreshSession.user.id,
      username: refreshSession.user.username,
    };
    await this.refreshSessionService.delete(refreshSession.id);
    return this.createPairTokens(payload);
  }

  async logout(refreshToken: string) {
    await this.refreshSessionService.deleteByRefreshToken(refreshToken);
  }

  getCookiesForLogOut() {
    return ['refreshToken=; HttpOnly; Path=/; Max-Age=0'];
  }

  private async createPairTokens(payload) {
    const accessTokenExpiresIn = this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    );
    const refreshTokenExpiresIn = this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );
    const refreshSessionData = {
      user: payload.id,
      expiresIn: refreshTokenExpiresIn,
    };
    const createdRefreshSession = await this.refreshSessionService.create(
      refreshSessionData,
    );
    return {
      accessToken: this.generateAccessToken(payload),
      accessTokenExpiresIn: accessTokenExpiresIn,
      refreshToken: createdRefreshSession.refreshToken,
      refreshTokenExpiresIn: createdRefreshSession.expiresIn,
      user: payload,
    };
  }

  private generateAccessToken(payload): string {
    return this.jwtService.sign(payload);
  }

  async generatePasswordHash(password: string) {
    // Todo сделать 10 как константу и вынести в отдельный файл
    return await bcrypt.hash(password, 10);
  }
}
