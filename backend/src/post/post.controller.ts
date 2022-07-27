import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { EditPostDto } from './dto/editPost.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import PostEntity from './post.entity';

@ApiTags('Работа с постами')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Создание поста' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        text: { type: 'string' },
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: PostEntity })
  @ApiInternalServerErrorResponse({
    description: 'Произошла ошибка при записи файла',
  })
  @Post('')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() media: Array<Express.Multer.File>,
    @User() user,
  ) {
    return await this.postService.createPost(createPostDto, media, user);
  }

  @ApiOperation({ summary: 'Получение постов' })
  @ApiCreatedResponse({ type: [PostEntity] })
  @Get('')
  async getPosts() {
    return await this.postService.getPosts();
  }

  @ApiOperation({ summary: 'Удаление поста' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'id удаляемого поста',
  })
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePost(@Param() params) {
    return await this.postService.deletePost(params.id);
  }

  @ApiOperation({ summary: 'Обновление поста' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        text: { type: 'string' },
        imageIds: { type: 'array' },
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: PostEntity })
  @ApiInternalServerErrorResponse({
    description: 'Произошла ошибка при записи файла',
  })
  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async editPost(
    @Body() editPostDto: EditPostDto,
    @Param('id') id: number,
    @User() user,
    @UploadedFiles() media: Array<Express.Multer.File>,
  ) {
    return await this.postService.editPost(editPostDto, id, user, media);
  }
}
