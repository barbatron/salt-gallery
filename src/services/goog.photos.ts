export class GooglePhotosService {
  public constructor(private readonly authHeaders: { [k: string]: string }) {}
  public async listLibraries(): Promise<{ albums: { id: string }[] }> {
    return (await fetch(
      "https://photoslibrary.googleapis.com/v1/albums?alt=json",
      { headers: this.authHeaders }
    ).then((resp) => resp.json())) as any;
  }
  public async getAlbum(albumId: string): Promise<{ id: string }> {
    return (await fetch(
      `https://photoslibrary.googleapis.com/v1/albums/${albumId}?alt=json`,
      { headers: this.authHeaders }
    ).then((resp) => resp.json())) as { id: string };
  }
  public async listMediaItems(): Promise<{}[]> {
    return (await fetch(
      `https://photoslibrary.googleapis.com/v1/mediaItems?alt=json`,
      { headers: this.authHeaders }
    ).then((resp) => resp.json())) as unknown as {}[];
  }
  public async searchMediaItems(
    params?: Partial<{ albumId: string }>
  ): Promise<{}[]> {
    const url = new URL(
      `https://photoslibrary.googleapis.com/v1/mediaItems:search?alt=json`
    );
    if (params?.albumId) url.searchParams.set("albumId", params.albumId);
    const req = new Request(url, { method: "POST", headers: this.authHeaders });
    console.log("search  req ", req);
    return (await fetch(req).then((resp) => resp.json())) as unknown as {}[];
  }

  public async getMediaItem(mediaItemId: string): Promise<any> {
    return await fetch(
      `https://photoslibrary.googleapis.com/v1/mediaItems/${mediaItemId}?alt=json`,
      { headers: this.authHeaders }
    ).then((resp) => resp.json());
  }
}
