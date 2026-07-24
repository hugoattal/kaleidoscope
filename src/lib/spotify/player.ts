import { ref } from "vue";

import { spotifyApi } from "@/lib/spotify/api.ts";
import { preloadAlbums } from "@/lib/spotify/offline.ts";
import type { TTrack } from "@/lib/store.ts";
import { playerStore } from "@/pages/player/lib/store.ts";

type TSpotifyTrack = Omit<TTrack, "total_duration">;

type TPlaybackItem = TSpotifyTrack | {
    id: string;
    type: "episode";
};

type TQueueResponse = {
    currently_playing: TPlaybackItem | null;
    queue: Array<TPlaybackItem>;
};

type TPlaybackResponse = {
    progress_ms: number | null;
};

export const previousTracks = ref<Array<TTrack>>([]);
export const currentTrack = ref<TTrack>();
export const nextTracks = ref<Array<TTrack>>([]);
export const progressMs = ref(0);
export const syncKey = ref(0);
export const syncing = ref(false);
export const displayEvents = ref(true);

let syncPromise: Promise<void> | undefined;

export function safeSyncQueue() {
    if (syncPromise) {
        return syncPromise;
    }

    syncing.value = true;
    syncPromise = syncQueue().finally(() => {
        syncing.value = false;
        syncPromise = undefined;
    });

    return syncPromise;
}

export async function syncQueue() {
    const response = await spotifyApi<TQueueResponse>("/me/player/queue");

    if (!response || response.currently_playing?.type !== "track") {
        currentTrack.value = undefined;
        nextTracks.value = response?.queue
            .filter(isTrack)
            .map(toTrack) ?? [];
        progressMs.value = 0;
        syncKey.value++;
        return;
    }

    const playing = toTrack(response.currently_playing);

    if (!currentTrack.value || currentTrack.value.id !== playing.id) {
        if (currentTrack.value) {
            previousTracks.value.push(currentTrack.value);
        }
        else if (!previousTracks.value.length) {
            previousTracks.value = [playing, playing];
        }

        currentTrack.value = playing;
    }

    nextTracks.value = response.queue
        .filter(isTrack)
        .map(toTrack);

    await syncPlayback();
    syncKey.value++;

    if (playerStore.offline) {
        preloadAlbums();
    }
}

export function offlineNextTrack() {
    if (!nextTracks.value.length) {
        return;
    }

    if (currentTrack.value) {
        previousTracks.value.push(currentTrack.value);
    }

    currentTrack.value = nextTracks.value.shift();
    progressMs.value = 0;
}

export async function syncPlayback() {
    const response = await spotifyApi<TPlaybackResponse>("/me/player");

    progressMs.value = response?.progress_ms ?? 0;
}

function isTrack(item: TPlaybackItem): item is TSpotifyTrack {
    return item.type === "track";
}

function toTrack(track: TSpotifyTrack): TTrack {
    return {
        ...track,
        total_duration: 0
    };
}
