import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileEntity } from "./file.entity";
import { DataSource, In, Repository } from "typeorm";
import * as path from "path";
import * as fs from "fs";
import * as sharp from "sharp";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
    private dataSource: DataSource
  ) {
  }

  async createFile(media: Array<Express.Multer.File>, postId) {
    try {
      const filesData: FileDto[] = [];
      for (const item in media) {
        const fileName =
          media[item].fieldname +
          "-" +
          Date.now() +
          path.extname(media[item].originalname);
        const filePath = path.resolve(__dirname, "..", "static");
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
        }
        if (media[item].mimetype.indexOf("video") === -1) {
          await sharp(media[item].buffer)
            .resize(1000, 500, { fit: "contain" })
            .rotate()
            .toFile(path.join(filePath, fileName));
        } else {
          fs.writeFileSync(path.join(filePath, fileName), media[item].buffer);
        }
        const fileData = await this.fileRepository.save({
          filename: fileName,
          mimetype: media[item].mimetype,
          post: postId
        });
        filesData.push({
          id: fileData.id,
          filename: fileData.filename,
          mimetype: fileData.mimetype
        });
      }
      return filesData;
    } catch (e) {
      throw new HttpException(
        "Произошла ошибка при записи файла",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteFile(imageId) {
    const filePath = path.resolve(__dirname, "..", "static");
    const file = await this.dataSource
      .getRepository(FileEntity)
      .findOne({ where: { id: imageId } });
    fs.unlink(`${filePath}/${file.filename}`, (err) => {
      if (err) {
        throw new HttpException(
          "Произошла ошибка при удалении файла",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    });
    return this.fileRepository.remove(file);
  }

  async deleteFiles(imageIds) {
    const filePath = path.resolve(__dirname, "..", "static");
    const files = await this.dataSource
      .getRepository(FileEntity)
      .findBy({ id: In(imageIds) });
    for (const id in files) {
      fs.unlink(`${filePath}/${files[id].filename}`, (err) => {
        if (err) {
          throw new HttpException(
            "Произошла ошибка при удалении файла",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      });
    }
    return this.fileRepository.remove(files);
  }
}
