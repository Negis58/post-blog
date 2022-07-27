import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { RefreshSessionEntity } from './refresh-session.entity';
import { RefreshSessionDto } from '../dto/refresh-session.dto';

@Injectable()
export class RefreshSessionService {
  constructor(
    @InjectRepository(RefreshSessionEntity)
    private refreshSessionRepository: Repository<RefreshSessionEntity>,
  ) {}

  async create(refreshSessionData: RefreshSessionDto) {
    const refreshToken = uuidv4();
    const newRefreshSession = await this.refreshSessionRepository.save({
      ...refreshSessionData,
      refreshToken: refreshToken,
    });

    return newRefreshSession;
  }

  async checkRelevance(refreshToken: string) {
    const refreshSession = await this.getRefreshToken(refreshToken);
    if (!refreshToken) {
      throw new HttpException(
        'Срок действия токена обновления истек',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const expirationDate =
      Number(refreshSession.createdAt) + Number(refreshSession.expiresIn);
    if (expirationDate < Date.now()) {
      throw new HttpException(
        'Срок действия токена обновления истек',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return refreshSession;
  }

  private async getRefreshToken(refreshToken: string) {
    return await this.refreshSessionRepository.findOne({
      where: { refreshToken: refreshToken },
    });
  }

  async delete(id: number) {
    await this.refreshSessionRepository.delete(id);
  }

  async deleteByRefreshToken(refreshToken: string) {
    return await this.refreshSessionRepository.delete({ refreshToken });
  }
}
