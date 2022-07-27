import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from '../files/file.entity';
import UserEntity from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class PostEntity {
  @ApiProperty({ example: '1', description: 'Идентификатор поста' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Заголовок', description: 'Заголовок поста' })
  @Column({ type: 'text' })
  title: string;

  @ApiProperty({ example: 'Какой-то текст', description: 'Текст поста' })
  @Column({ type: 'text' })
  text: string;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;

  @ApiProperty({ type: () => [FileEntity] })
  @OneToMany(() => FileEntity, (fileEntity) => fileEntity.post, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  attachments: FileEntity[];

  @CreateDateColumn()
  // @Column({ type: "time with time zone", default: () => "NOW()" })
  createdAt: Date;

  @CreateDateColumn()
  // @Column({ type: "time with time zone", default: () => "NOW()" })
  updatedAt: Date;
}

export default PostEntity;
