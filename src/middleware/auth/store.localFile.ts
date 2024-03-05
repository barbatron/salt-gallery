import { TOAuth2AccessToken } from "@bogeychan/elysia-oauth2";
import { OauthStore } from "./store";
import fs from "fs/promises";

const filename = "./_oauth_store.tmp";
const filenameFor = (name: string) => filename;
// `${path.parse(filename).name}-${name}.${path.parse(filename).ext}`;

export class LocalFileOauthStore implements OauthStore {
  async get(
    _ctx: unknown,
    name: string
  ): Promise<TOAuth2AccessToken | undefined> {
    try {
      console.log(`${LocalFileOauthStore.name}.get`, { name });
      const buffer = await fs.readFile(filenameFor(name));
      return JSON.parse(buffer.toString("utf-8")) as unknown as
        | TOAuth2AccessToken
        | undefined;
    } catch (err) {
      console.warn(`${LocalFileOauthStore.name}.get error`, err);
    }
  }
  async set(
    _ctx: unknown,
    name: string,
    token: TOAuth2AccessToken
  ): Promise<void> {
    console.log(`${LocalFileOauthStore.name}.set`, { name, token });
    const buffer = Buffer.from(JSON.stringify(token));
    await fs.writeFile(filenameFor(name), buffer.toString("utf-8"));
  }
  async delete(_ctx: unknown, name: string): Promise<void> {
    console.log(`${LocalFileOauthStore.name}.delete`, { name });
    await fs.rm(filenameFor(name));
  }
}
