import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostEntity from './post.entity';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [AuthModule, FilesModule, TypeOrmModule.forFeature([PostEntity])],
})
export class PostModule {}
