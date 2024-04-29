import { spotifyApi } from "@/lib/spotify/api.ts";
import { userId } from "@/lib/spotify/local.ts";

export async function saveToPlaylist(playlistId: string, tracks: Array<string>) {
    for (let i = 0; i < tracks.length; i += 100) {
        await spotifyApi(`/playlists/${ playlistId }/tracks`, {
            body: JSON.stringify({ tracks: tracks.slice(i, i + 100).map((id) => ({ uri: `spotify:track:${ id }` })) }),
            method: "DELETE"
        });
    }

    for (let i = 0; i < tracks.length; i += 100) {
        await spotifyApi(`/playlists/${ playlistId }/tracks`, {
            body: JSON.stringify({ uris: tracks.slice(i, i + 100).map((id) => `spotify:track:${ id }`) }),
            method: "POST"
        });
    }
}

export async function createPlaylist(name: string, tracks: Array<string>) {
    const { id } = await spotifyApi(`/users/${ userId.value }/playlists`, {
        body: JSON.stringify({ name: name || "KS Export" }),
        method: "POST"
    });

    await saveToPlaylist(id, tracks);
}
