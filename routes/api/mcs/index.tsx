import { Handlers } from "$fresh/server.ts";
import { Artist } from "../../../entities/Artist.ts";

const kv = await Deno.openKv();

export const handler: Handlers<Artist | null> = {
  async GET(_req, _ctx) {
    const artists = [];
    for await (const res of kv.list({ prefix: ["artist"] })) {
      artists.push(res.value);
    }
    return new Response(JSON.stringify(artists));
  },
  async POST(req, _ctx) {
    const url = new URL(req.url);
    const name = url.searchParams.get("name") || "";
    const newArtist: Artist = { name, id: String(crypto.randomUUID()) };
    const artist = newArtist as Artist;
    const artistKey = ["artist", artist.id];
    const ok = await kv.atomic().set(artistKey, artist).commit();
    if (!ok) throw new Error("Something went wrong.");
    return new Response(JSON.stringify(newArtist));
  },
};
