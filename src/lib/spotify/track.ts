import { computeTotalDuration, store } from "@/lib/store.ts";
import { addAudioFeatures } from "@/lib/spotify/cache.ts";

export async function processTracks() {
    await addAudioFeatures(store.tracks);
    computeTotalDuration();
}
