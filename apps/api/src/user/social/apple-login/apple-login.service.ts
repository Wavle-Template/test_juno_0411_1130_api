/**
 * @module UserSocialAppleLoginModule
 */
import jwt from "jsonwebtoken";
import { Inject, Injectable } from "@nestjs/common";
import { JwksClient } from "jwks-rsa";
import { APPLE_JWKS_CLIENT } from "./apple-login.const";
import { IUserSocialLoginService } from "../social-login.interface";
import { ConfigService } from "@nestjs/config";

/**
 * 애플 계정으로 로그인하기 위한 서비스
 * @category Provider
 */
@Injectable()
export class UserSocialAppleLoginService implements IUserSocialLoginService {
  /** 컨픽 서비스 */
  #configService: ConfigService;
  /** JSON Web Key Set 클라이언트 */
  #jwksClient: JwksClient;

  /**
   * @param jwksClient JSON Web Key Set 클라이언트
   * @param configService 컨픽 서비스
   */
  constructor(@Inject(APPLE_JWKS_CLIENT) jwksClient: JwksClient, configService: ConfigService) {
    this.#jwksClient = jwksClient;
    this.#configService = configService;
  }

  /**
   * 애플 계정으로 로그인하여 얻은 ID 토큰으로 소셜 ID를 얻습니다.
   * @param token ID 토큰
   * @returns 소셜 ID
   */
  async validate(token: string): Promise<string> {
    const keyId = this.#configService.get("APPLE_API_LOGIN_KEY_ID");
    const key = await this.#jwksClient.getSigningKey(keyId);
    const publicKey = key.getPublicKey();

    const decodedToken = jwt.verify(token, publicKey, {
      complete: true,
      algorithms: ["RS256"],
      audience: this.#configService.get("APPLE_API_APP_ID"),
      issuer: "https://appleid.apple.com",
    }) as jwt.JwtPayload;
    const socialId = decodedToken.sub;

    return socialId;
  }
}
