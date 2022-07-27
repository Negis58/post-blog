import { ApiProperty } from '@nestjs/swagger';

export class TokensEntity {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZXMiOiJ1c2VyIiwiaWF0IjoxNjQyOTMzMTQ2LCJleHAiOjE2NDI5MzY3NDZ9.vCQlOHQzhb7WLPcxPdM_yXeFTZ7Qk1C69kOnwjDPSR8',
    description: 'Токен доступа',
  })
  accessToken: string;

  @ApiProperty({
    example: '3600000',
    description: 'Время жизни токена доступа',
  })
  accessTokenExpiresIn: string;

  @ApiProperty({
    example: 'f9f9e1ec-d8ad-425d-9678-06e26576cdcd',
    description: 'Токен обновления',
  })
  refreshToken: string;

  @ApiProperty({
    example: '57851014452',
    description: 'Время жизни токена обновления',
  })
  refreshTokenExpiresIn: number;
}
