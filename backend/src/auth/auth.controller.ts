import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import RegisterDto from "./dto/register.dto";
import LoginDto from "./dto/login.dto";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { TokensEntity } from "./tokens.entity";

@ApiTags("Авторизация/Аутентификация")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @ApiOperation({ summary: "Регистрация" })
  @ApiCreatedResponse({ type: TokensEntity })
  @ApiBadRequestResponse({
    description: "Возникает, когда email пользователя уже зарегистрирован"
  })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Post("sign-up")
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ) {
    console.log(registerDto);
    const data = await this.authService.register(registerDto);
    response.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      maxAge: Number(data.refreshTokenExpiresIn),
      path: "/auth"
    });
    return {
      user: {
        username: data.user.username,
        id: data.user.id
      },
      accessToken: data.accessToken
    };
  }

  @ApiOperation({ summary: "Авторизация" })
  @ApiCreatedResponse({
    description: "Токен доступа и обновления",
    type: TokensEntity
  })
  @ApiBadRequestResponse({ description: "Пользователь не найден" })
  @ApiUnauthorizedResponse({
    description: "Возникает, когда email пользователя уже зарегистрирован"
  })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Post("sign-in")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    console.log("loginDto", loginDto);
    const data = await this.authService.login(loginDto);
    response.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      maxAge: Number(data.refreshTokenExpiresIn),
      path: "/api/auth"
    });
    return {
      user: {
        username: data.user.username,
        id: data.user.id
      },
      accessToken: data.accessToken
    };
  }

  @ApiOperation({ summary: "Обновление токена" })
  @ApiOkResponse({
    description: "Обновленная пара токенов",
    type: TokensEntity
  })
  @ApiUnauthorizedResponse({ description: "Токен авторизации истек" })
  @ApiHeader({
    name: "Cookie",
    description:
      "Токен обновления: refreshToken=b21934be-d521-4059-9dd8-31229c8b2f45"
  })
  @Post("refresh-token")
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const data = await this.authService.refreshToken(
      request.cookies["refreshToken"]
    );
    response.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      maxAge: Number(data.refreshTokenExpiresIn),
      path: "/api/auth"
    });
    return {
      user: {
        username: data.user.username,
        id: data.user.id
      },
      accessToken: data.accessToken
    };
  }

  @ApiOperation({ summary: "Удаление сессии" })
  @ApiOkResponse({ description: "Удаление сессии" })
  @ApiHeader({
    name: "Cookie",
    description:
      "Токен обновления: refreshToken=b21934be-d521-4059-9dd8-31229c8b2f45"
  })
  @Post("logout")
  async logOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.authService.logout(request.cookies["refresh-token"]);
    response.setHeader("Set-Cookie", this.authService.getCookiesForLogOut());
  }
}
