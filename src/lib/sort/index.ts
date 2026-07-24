import { computeTotalDuration, store } from "@/lib/store.ts";

export function shuffle() {
    const remaining = [...store.tracks];
    store.tracks = [];

    while (remaining.length) {
        const index = Math.floor(Math.random() * remaining.length);
        store.tracks.push(remaining.splice(index, 1)[0]);
    }

    computeTotalDuration();
}
