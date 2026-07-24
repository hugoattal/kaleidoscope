import { spotifyApiList } from "@/lib/spotify/api.ts";
import type { TTrack } from "@/lib/store.ts";

type TPlaylistSummary = {
    id: string;
    name: string;
};

type TSpotifyTrack = Omit<TTrack, "total_duration">;

type TPlaylistItem = {
    item: TSpotifyTrack | {
        id: string;
        type: "episode";
    };
};

type TSpotifyCache = {
    playlists: Record<string, Array<TTrack>>;
    userPlaylists?: Array<TPlaylistSummary>;
};

export const cache: TSpotifyCache = {
    playlists: {}
};

export async function getPlaylist(playlistId: string) {
    if (!cache.playlists[playlistId]) {
        const items = await spotifyApiList<TPlaylistItem>(`/playlists/${ playlistId }/items?fields=next,items(item(type,id,name,artists(name),duration_ms,album(release_date,images(url))))`);
        cache.playlists[playlistId] = items
            .filter((item): item is { item: TSpotifyTrack; } => item.item.type === "track")
            .map((item) => ({
                ...item.item,
                total_duration: 0
            }));
    }

    return cache.playlists[playlistId];
}

export async function getUserPlaylists() {
    if (!cache.userPlaylists) {
        cache.userPlaylists = await spotifyApiList<TPlaylistSummary>("/me/playlists");
    }

    return cache.userPlaylists;
}
