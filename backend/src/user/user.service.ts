import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './user.entity';
import { Repository } from 'typeorm';
import RegisterDto from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(registerDto: RegisterDto) {
    return await this.userRepository.save(registerDto);
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      select: ['id', 'username', 'email', 'password'],
      where: { email: email },
    });
  }
}
