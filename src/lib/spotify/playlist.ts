import { spotifyApi } from "@/lib/spotify/api.ts";

export async function saveToPlaylist(playlistId: string, tracks: Array<string>) {
    const uris = tracks.map((id) => `spotify:track:${ id }`);

    await spotifyApi(`/playlists/${ playlistId }/items`, {
        body: JSON.stringify({ uris: uris.slice(0, 100) }),
        method: "PUT"
    });

    for (let i = 100; i < uris.length; i += 100) {
        await spotifyApi(`/playlists/${ playlistId }/items`, {
            body: JSON.stringify({ uris: uris.slice(i, i + 100) }),
            method: "POST"
        });
    }
}

export async function createPlaylist(name: string, tracks: Array<string>) {
    const playlist = await spotifyApi<{ id: string }>("/me/playlists", {
        body: JSON.stringify({ name: name || "KS Export" }),
        method: "POST"
    });

    if (!playlist) {
        throw new Error("Spotify returned no playlist after creation");
    }

    await saveToPlaylist(playlist.id, tracks);
}
