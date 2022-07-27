import UserEntity from '../../user/user.entity';

export class RefreshSessionDto {
  user: UserEntity;
  expiresIn: string;
}
