import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RefreshSessionEntity } from '../auth/refresh-session/refresh-session.entity';
import postEntity, { PostEntity } from '../post/post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
class UserEntity {
  @ApiProperty({ example: '1', description: 'Идентификатор поста' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'admin@admin.com',
    description: 'email пользователя',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'admin', description: 'Никнейм пользователя' })
  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @OneToMany(
    () => RefreshSessionEntity,
    (refreshSessionEntity) => refreshSessionEntity.user,
    { onDelete: 'CASCADE' },
  )
  refreshSessions: RefreshSessionEntity[];

  @OneToMany(() => PostEntity, (postEntity) => postEntity.user, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  posts: PostEntity[];
}

export default UserEntity;
