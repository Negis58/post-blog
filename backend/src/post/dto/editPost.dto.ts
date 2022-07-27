import { ApiProperty } from '@nestjs/swagger';

export class EditPostDto {
  @ApiProperty({ example: 'Заголовок', description: 'Заголовок поста' })
  title: string;

  @ApiProperty({ example: 'Какой-то текст', description: 'Текст поста' })
  text: string;

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
    description: 'Массив удаляемых изображений',
  })
  imageIds: number[];
}
