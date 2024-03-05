import { Elysia } from "elysia";
import { oauth } from "./middleware/auth/oauth";

const app = new Elysia();

function userPage(user: {}, libraries: any, logout: string) {
  const html = `<!DOCTYPE html>
    <html lang="en">
    <body>
      <h4>User</h4>
      <pre>${JSON.stringify(user, null, "\t")}</pre>
      <h4>Libraries</h4>
      <pre>${JSON.stringify(libraries, null, "\t")}</pre>
      <a href="${logout}">Logout</a>
    </body>
    </html>`;

  return new Response(html, { headers: { "Content-Type": "text/html" } });
}

app
  .use(oauth)
  .get("/", async (ctx) => {
    // get login, callback, logout urls for one or more OAuth 2.0 profiles
    const profiles = ctx.profiles("google");

    // check if one or more OAuth 2.0 profiles are authorized
    if (await ctx.authorized("google")) {
      const user = await fetch(
        " https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        {
          // ... and use the Authorization header afterwards
          headers: await ctx.tokenHeaders("google"),
        }
      ).then((resp) => resp.json());

      const libraries = await fetch(
        "https://photoslibrary.googleapis.com/v1/albums?alt=json",
        { headers: await ctx.tokenHeaders("google") }
      ).then((resp) => resp.json());

      return userPage(
        user ?? { __note: "(undef fallback)" },
        libraries,
        profiles.google.logout
      );
    }

    // Render login page
    const html = `<!DOCTYPE html>
    <html lang="en">
    <body>
      <h2>Login with <a href="${profiles.google.login}">Google</a></h2>
    </body>
    </html>`;

    return new Response(html, { headers: { "Content-Type": "text/html" } });
  })
  .listen(3000);
