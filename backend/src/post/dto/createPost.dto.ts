import UserEntity from '../../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Заголовок', description: 'Заголовок поста' })
  title: string;

  @ApiProperty({ example: 'Какой-то текст', description: 'Текст поста' })
  text: string;

  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;
}
