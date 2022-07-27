import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new HttpException(
        "Пользователь не авторизован",
        HttpStatus.UNAUTHORIZED
      );
    }
    const bearer = authHeader.split(" ")[0];
    const token = authHeader.split(" ")[1];
    if (bearer !== "Bearer" || !token) {
      throw new HttpException(
        "Пользователь не авторизован",
        HttpStatus.UNAUTHORIZED
      );
    }
    const secretKey = this.configService.get("JWT_ACCESS_TOKEN_SECRET");
    const user = this.jwtService.verify(token, { secret: secretKey });
    req.user = user;
    return true;
  }
}
