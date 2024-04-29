import { computeTotalDuration, store } from "@/lib/store.ts";
import { spotifyApi } from "@/lib/spotify/api.ts";

export async function processTracks() {
    const features = [];

    for (let i = 0; i < store.tracks.length; i += 100) {
        features.push(...(await spotifyApi(`/audio-features?ids=${ store.tracks.slice(i, i + 100).map((track) => track.id).join(",") }`)).audio_features);
    }

    store.tracks.forEach((track) => {
        const feature = features.find((feature: any) => feature.id === track.id);

        if (feature) {
            track.features = feature;
        }
    });

    computeTotalDuration();
}
