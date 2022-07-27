import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import PostEntity from '../post/post.entity';
import { Post } from '@nestjs/common';
import postEntity from '../post/post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class FileEntity {
  @ApiProperty({ example: '1', description: 'Идентификатор поста' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'filename-123456',
    description: 'Название изображения',
  })
  @Column()
  filename: string;

  @ApiProperty({ example: 'image', description: 'Тип файла' })
  @Column()
  mimetype: string;

  @ManyToOne(() => PostEntity, (postEntity) => postEntity.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: PostEntity;
}
