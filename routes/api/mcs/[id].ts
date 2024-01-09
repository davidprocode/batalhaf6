import { Handlers } from "$fresh/server.ts";
import { Artist } from "../../../entities/Artist.ts";

const kv = await Deno.openKv();

export const handler: Handlers<Artist | null> = {
  async GET(_req, ctx) {
    const id = ctx.params.id;
    const key = ["artist", id];
    const artist = (await kv.get<Artist>(key)).value!;
    return new Response(JSON.stringify(artist));
  },
  async DELETE(_req, ctx) {
    const id = ctx.params.id;
    const artistKey = ["artist", id];
    const artistRes = await kv.get(artistKey);
    if (!artistRes.value) return new Response(`no artis with id ${id} found`);
    const ok = await kv.atomic().check(artistRes).delete(artistKey).commit();
    if (!ok) throw new Error("Something went wrong.");
    return new Response(`artist ${id} deleted`);
  },
  async PUT(req, ctx) {
    const id = ctx.params.id;
    const artist = (await req.json()) as Artist;
    const artistKey = ["artist", id];
    const artistRes = await kv.get(artistKey);
    if (!artistRes.value) return new Response(`no artist with id ${id} found`);
    const ok = await kv.atomic().check(artistRes).set(artistKey, artist)
      .commit();
    if (!ok) throw new Error("Something went wrong.");
    return new Response(JSON.stringify(artist));
  },
};
