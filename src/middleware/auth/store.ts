import { type TOAuth2AccessToken } from "@bogeychan/elysia-oauth2";

export interface OauthStore {
  get(ctx: unknown, name: string): Promise<TOAuth2AccessToken | undefined>;
  set(ctx: unknown, name: string, token: TOAuth2AccessToken): Promise<void>;
  delete(ctx: unknown, name: string): Promise<void>;
}
