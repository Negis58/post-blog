import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Адрес электронной почты',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'username',
    description: 'Имя аккаунта пользователя',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: '12345678',
    description: 'Пароль для регистрации аккаунта',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export default RegisterDto;
