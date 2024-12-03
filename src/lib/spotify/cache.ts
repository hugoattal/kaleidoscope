import { TTrack } from "@/lib/store.ts";
import { spotifyApi, spotifyApiList } from "@/lib/spotify/api.ts";
import { userId } from "@/lib/spotify/local.ts";

export const cache = {
    features: {} as Record<string, TTrack>,
    playlists: {} as Record<string, Array<TTrack>>
} as {
    features: Record<string, TTrack>;
    playlists: Record<string, Array<TTrack>>;
    userPlaylists?: Array<{ id: string; name: string }>;
};

export async function getPlaylist(playlistId: string) {
    if (!cache.playlists[playlistId]) {
        cache.playlists[playlistId] = (await spotifyApiList(`/playlists/${ playlistId }/tracks?fields=next,items(track(id,popularity,name,artists(name),duration_ms,album(release_date,images(url))))`)).map((item: any) => item.track);
    }

    return cache.playlists[playlistId];
}

export async function getUserPlaylists() {
    if (!cache.userPlaylists) {
        cache.userPlaylists = await spotifyApiList(`/users/${ userId.value }/playlists`);
    }

    return cache.userPlaylists;
}

export async function addAudioFeatures(tracks: Array<TTrack>) {
    try {
        const missingTracks = tracks.filter((track) => !cache.features[track.id]);

        for (let i = 0; i < missingTracks.length; i += 100) {
            const response = await spotifyApi(`/audio-features?ids=${ missingTracks.slice(i, i + 100).map((track) => track.id).join(",") }`);
            const features = (response.audio_features);

            for (const feature of features) {
                cache.features[feature.id] = feature;
            }
        }

        for (const track of tracks) {
            track.features = cache.features[track.id];
        }
    }
    catch (e) {
        console.error(e);
    }
}
