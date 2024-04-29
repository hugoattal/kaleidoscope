<template>
    <FBox
        class="mixer-wrapper"
        :depth="-2"
    >
        <div class="name">
            Select at least two playlists to mix
        </div>
        <div class="actions">
            <span>Target duration:</span>
            <FNumberInput
                v-model="targetDuration"
                clamp
                class="time"
                :fixed="0"
                :max="300"
                :min="5"
                suffix="min"
            />
            <span>({{ readableDuration }})</span>
            <FButton @click="generate">
                Generate
            </FButton>
        </div>
    </FBox>
</template>

<script setup lang="ts">
import { FBox, FButton, FNumberInput } from "@ferris-wheel/design";
import { computed, ref } from "vue";
import { store } from "@/lib/store.ts";
import { spotifyApiList } from "@/lib/spotify/api.ts";
import { processTracks } from "@/lib/spotify/track.ts";

const targetDuration = ref<number>(60);
const readableDuration = computed(() => {
    const hours = Math.floor(targetDuration.value / 60);
    const minutes = targetDuration.value % 60;

    return `${ hours }h ${ minutes }m`;
});

async function generate() {
    if (store.selectedPlaylists.size < 2) {
        alert("Select at least two playlists to merge");
        return;
    }

    store.tracks = [];
    const playlists = [];

    for (const playlistId of store.selectedPlaylists) {
        playlists.push((await spotifyApiList(`/playlists/${ playlistId }/tracks?fields=next,items(track(id,popularity,name,artists(name),duration_ms,album(release_date,images(url))))`)).map((item: any) => item.track));
    }

    const tempTracks = []as Array<{
        progress: number;
        track: any;
    }>;

    for (const playlist of playlists) {
        const playlistDuration = playlist.reduce((acc, track) => acc + track.duration_ms, 0);
        let playlistTime = 0;

        for (const track of playlist) {
            tempTracks.push({
                progress: playlistTime / playlistDuration,
                track
            });

            playlistTime += track.duration_ms;
        }
    }

    tempTracks.sort((a, b) => a.progress - b.progress);

    while (tempTracks.reduce((acc, track) => acc + track.track.duration_ms, 0) > targetDuration.value * 60 * 1000) {
        tempTracks.splice(Math.floor(Math.random() * tempTracks.length), 1);
    }

    store.tracks = tempTracks.map((tempTrack) => tempTrack.track);

    await processTracks();
}
</script>

<style scoped>
.mixer-wrapper {
    padding: var(--fw-length-xs);
    width: 100%;
    display: flex;
    gap: var(--fw-length-xs);
    flex-direction: column;

    .name {
        text-transform: uppercase;
        font-size: 0.8rem;
    }

    .actions {
        display: flex;
        gap: var(--fw-length-xs);
        align-items: center;
    }

    .time {
        width: 200px;
    }
}
</style>
