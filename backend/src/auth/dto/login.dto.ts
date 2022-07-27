import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Адрес электронной почты',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Пароль для регистрации аккаунта',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export default LoginDto;
