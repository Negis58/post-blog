import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PostgresModule } from "./databases/postgres.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { FilesModule } from "./files/files.module";
import * as path from "path";
import { ServeStaticModule } from "@nestjs/serve-static";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, "..", "static"),
      exclude: ["api/*"]
    }),
    PostgresModule,
    AuthModule,
    UserModule,
    PostModule,
    FilesModule
  ]
})
export class AppModule {
}
