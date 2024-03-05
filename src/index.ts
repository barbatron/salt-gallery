import { Elysia } from "elysia";
import { oauth } from "./middleware/auth/oauth";
import { GooglePhotosService } from "./services/goog.photos";
import { GoogleUserService } from "./services/goog.user";
const app = new Elysia();

function userPage(user: {}, stuff: any, logout: string) {
  const html = `<!DOCTYPE html>
    <html lang="en">
    <body>
      <h4>User</h4>
      <pre>${JSON.stringify(user, null, "\t")}</pre>
      ${Object.entries(stuff).map(
        ([key, value]) => `
          <h4>${key}</h4>
          <pre>${JSON.stringify(value, null, "\t")}</pre>
        `
      )}
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
      const googTokenHeaders = await ctx.tokenHeaders("google");
      const userSvc = new GoogleUserService(googTokenHeaders);
      const user = await userSvc.get();

      const photosSvc = new GooglePhotosService(googTokenHeaders);
      const libraries = await photosSvc.listLibraries();

      const album = await photosSvc.getAlbum(libraries.albums[0].id);
      const mediaItems = await photosSvc.searchMediaItems({
        albumId: album.id,
      });
      console.log("mediaItems", mediaItems);

      return userPage(
        user ?? { __note: "(undef fallback)" },
        { libraries, album, mediaItems },
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
