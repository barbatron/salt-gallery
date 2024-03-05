type ElysiaOauthContext = any;

export class GoogleUserService {
  public constructor(private readonly authHeaders: { [k: string]: string }) {}
  public async get() {
    return await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        // ... and use the Authorization header afterwards
        headers: this.authHeaders,
      }
    ).then((resp) => resp.json());
  }
}
