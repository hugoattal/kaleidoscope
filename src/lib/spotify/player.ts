import { ref } from "vue";
import { spotifyApi } from "@/lib/spotify/api.ts";
import { TTrack } from "@/lib/store.ts";
import { playerStore } from "@/pages/player/lib/store.ts";
import { preloadAlbums } from "@/lib/spotify/offline.ts";

export const previousTracks = ref<Array<TTrack>>([]);
export const currentTrack = ref<TTrack>();
export const nextTracks = ref<Array<TTrack>>([]);
export const progressMs = ref(0);
export const syncKey = ref(0);
export const syncing = ref(false);
export const displayEvents = ref(true);


export async function safeSyncQueue() {
    if (!syncing.value) {
        syncing.value = true;
        try {
            await syncQueue();
        }
        finally {
            syncing.value = false;
        }
    }
}

export async function syncQueue() {
    const response = await spotifyApi("/me/player/queue");

    if (!response.currently_playing) {
        return;
    }

    if (!currentTrack.value || currentTrack.value.id !== response.currently_playing.id) {
        if (currentTrack.value) {
            previousTracks.value.push(currentTrack.value);
        }
        else if (!previousTracks.value.length) {
            previousTracks.value = [response.currently_playing, response.currently_playing];
        }

        if (response.currently_playing.id === nextTracks.value[0]?.id && response.queue[0]?.id === nextTracks.value[1]?.id) {
            currentTrack.value = nextTracks.value.shift();

            setTimeout(async () => {
                nextTracks.value = response.queue;
            }, 3000);
        }
        else {
            currentTrack.value = response.currently_playing;
            nextTracks.value = response.queue;
        }
    }

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
    const response = await spotifyApi("/me/player");

    progressMs.value = response.progress_ms;
}
