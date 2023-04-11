/**
 * 애플 계정으로 로그인하기 위한 모듈입니다.
 *
 * ### 다이어그램
 *
 * ```mermaid
 * classDiagram
 * ConfigModule --> UserSocialAppleLoginModule : Import
 * AuthModule --> UserSocialAppleLoginModule : Import
 * UserSocialModule --> UserSocialAppleLoginModule : Import
 * UserSocialAppleLoginModule o-- JwksClient : Provide
 * UserSocialAppleLoginModule o-- UserSocialAppleLoginService : Provide
 * UserSocialAppleLoginModule o-- UserSocialAppleLoginResolver : Provide
 * UserSocialAppleLoginService <.. JwksClient : Inject
 * UserSocialAppleLoginService <.. ConfigService : Inject
 * UserSocialAppleLoginResolver <.. ConfigService : Inject
 * UserSocialAppleLoginResolver <.. UserSocialAppleLoginService : Inject
 * UserSocialAppleLoginResolver <.. UserSocialService : Inject
 * UserSocialAppleLoginResolver <.. AuthTokenService : Inject
 * ```
 * @module UserSocialAppleLoginModule
 */
import { JwksClient } from "jwks-rsa";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "@app/auth";
import { UserSocialModule } from "../social.module";
import { UserSocialAppleLoginService } from "./apple-login.service";
import { UserSocialAppleLoginResolver } from "./apple-login.resolver";
import { APPLE_JWKS_CLIENT, APPLE_JWKS_URL } from "./apple-login.const";

/**
 * 사용자 소셜 애플 로그인 모듈
 * @hidden
 */
@Module({
  imports: [ConfigModule, AuthModule, UserSocialModule],
  providers: [
    {
      provide: APPLE_JWKS_CLIENT,
      useFactory: () => {
        return new JwksClient({
          jwksUri: APPLE_JWKS_URL,
          cache: true,
        });
      },
    },
    UserSocialAppleLoginService,
    UserSocialAppleLoginResolver,
  ],
  exports: [UserSocialAppleLoginService],
})
export class UserSocialAppleLoginModule {
  constructor(configService: ConfigService) {
    if (configService.get("APPLE_API_APP_ID") == null) throw new Error("APPLE_API_APP_ID가 없습니다.");
    if (configService.get("APPLE_API_TEAM_ID") == null) throw new Error("APPLE_API_TEAM_ID가 없습니다.");
    if (configService.get("APPLE_API_LOGIN_KEY_ID") == null) throw new Error("APPLE_API_LOGIN_KEY_ID가 없습니다.");
    if (configService.get("APPLE_API_LOGIN_KEY_PATH") == null) throw new Error("APPLE_API_LOGIN_KEY_PATH가 없습니다.");
  }
}
