import oauth2, {
  type TOAuth2AccessToken,
  google,
} from "@bogeychan/elysia-oauth2";
import { LocalFileOauthStore } from "./store.localFile";
import { randomBytes } from "crypto";

const globalState = randomBytes(8).toString("hex");
let globalToken: TOAuth2AccessToken | undefined;

const store = new LocalFileOauthStore();

export const oauth = oauth2({
  profiles: {
    // define multiple OAuth 2.0 profiles
    google: {
      provider: google({
        access_type: "offline",
        include_granted_scopes: true,
        prompt: "consent",
      }),
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/photoslibrary.readonly",
        "https://www.googleapis.com/auth/photoslibrary.readonly.originals",
      ],
    },
  },
  state: {
    // custom state verification between requests
    check(_ctx, name, state) {
      console.log("oauth.state.check", { name, state });
      return state === globalState;
    },
    generate(_ctx, name) {
      console.log("oauth.state.generate", { name });
      return globalState;
    },
  },
  storage: {
    // storage of users' access tokens is up to you
    async get(_ctx, name) {
      console.log("oauth2.storage.get", { name });
      return await store.get(_ctx, name);
    },
    async set(_ctx, name, token) {
      console.log("oauth2.storage.set", { name, token });
      return await store.set(_ctx, name, token);
    },
    async delete(_ctx, name) {
      console.log("oauth2.storage.delete", { name });
      return await store.delete(_ctx, name);
    },
  },
});
