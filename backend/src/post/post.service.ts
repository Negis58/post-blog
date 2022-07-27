import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import PostEntity from "./post.entity";
import { DataSource, Repository } from "typeorm";
import { CreatePostDto } from "./dto/createPost.dto";
import { FilesService } from "../files/files.service";
import { EditPostDto } from "./dto/editPost.dto";
import UserEntity from "../user/user.entity";
import { FileEntity } from "../files/file.entity";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private fileService: FilesService,
    private dataSource: DataSource
  ) {
  }

  async createPost(
    createPostDto: CreatePostDto,
    media: Array<Express.Multer.File>,
    user
  ) {
    const post = await this.postRepository.save({
      title: createPostDto.title,
      text: createPostDto.text,
      user: user.id
    });
    let filesData;
    if (media !== []) {
      filesData = await this.fileService.createFile(media, post.id);
    }
    const userData = await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder("user")
      .where("id = :id", { id: user.id })
      .getOne();
    return {
      ...post,
      user: userData,
      attachments: filesData
    };
  }

  async getPosts() {
    return await this.dataSource
      .getRepository(PostEntity)
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .leftJoinAndSelect("post.attachments", "attachment")
      .orderBy("post.createdAt", "DESC")
      .getMany();
  }

  async deletePost(id: number) {
    return await this.postRepository.delete({ id: id });
  }

  async editPost(
    editPostDto: EditPostDto,
    postId: number,
    user,
    media: Array<Express.Multer.File>
  ) {
    console.log(editPostDto);
    if (editPostDto.imageIds) {
      if (typeof editPostDto.imageIds === "string")
        await this.fileService.deleteFile(editPostDto.imageIds);
      if (typeof editPostDto.imageIds === "object")
        await this.fileService.deleteFiles(editPostDto.imageIds);
    }
    if (media !== []) {
      await this.fileService.createFile(media, postId);
    }
    const updatePostData = await this.dataSource
      .createQueryBuilder()
      .update(PostEntity)
      .set({ title: editPostDto.title, text: editPostDto.text })
      .where("id = :id", { id: postId })
      .returning("*")
      .execute();
    const userData = await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder("user")
      .where("id = :id", { id: user.id })
      .getOne();
    const filesData = await this.dataSource
      .getRepository(FileEntity)
      .createQueryBuilder("file")
      .where("file.postId = :id", { id: postId })
      .getMany();
    return {
      ...updatePostData.raw[0],
      user: userData,
      attachments: filesData
    };
  }
}
