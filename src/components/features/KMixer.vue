<template>
    <FBox
        class="mixer-wrapper"
        :depth="-2"
    >
        <div class="options">
            <div class="option">
                <div class="name">
                    Mix mode
                </div>
                <div class="form">
                    <FSelect
                        v-model="mergeType"
                        class="select"
                        :options="dropdownOptions"
                    />
                </div>
            </div>
            <div class="option">
                <div class="name">
                    Target duration (0 to disable)
                </div>
                <div class="form">
                    <FNumberInput
                        v-model="targetDuration"
                        clamp
                        class="time"
                        :fixed="0"
                        :max="300"
                        :min="0"
                        :step="5"
                        suffix="min"
                    />
                    <span>({{ readableDuration }})</span>
                </div>
            </div>
            <div class="option">
                <div class="name">
                    Remove duplicates
                </div>
                <div class="form">
                    <FCheckbox
                        v-model="removeDuplicates"
                    />
                </div>
            </div>
        </div>
        <FButton
            icon="manufacturing"
            @click="generate"
        >
            Generate
        </FButton>
    </FBox>
</template>

<script setup lang="ts">
import { FBox, FButton, FCheckbox, FNumberInput, FSelect } from "@ferris-wheel/design";
import { computed, ref } from "vue";
import { store, TTrack } from "@/lib/store.ts";
import { processTracks } from "@/lib/spotify/track.ts";
import { getPlaylist } from "@/lib/spotify/cache.ts";

enum EMergeType {
    BackToBack = "BackToBack",
    Interleaved = "Interleaved",
    Progress = "Progress"
}

const dropdownOptions = [
    { id: EMergeType.BackToBack, label: "Back to back" },
    { id: EMergeType.Interleaved, label: "Interleaved" },
    { id: EMergeType.Progress, label: "Progress" }
];

const mergeType = ref<EMergeType>(EMergeType.BackToBack);
const removeDuplicates = ref<boolean>(true);

const targetDuration = ref<number>(0);
const readableDuration = computed(() => {
    const hours = Math.floor(targetDuration.value / 60);
    const minutes = targetDuration.value % 60;

    return `${ hours }h ${ minutes }m`;
});

async function generate() {
    if (store.selectedPlaylists.length < 1) {
        alert("Select at least one playlist to merge");
        return;
    }

    store.tracks = [];
    const playlists = [];

    for (const playlistId of store.selectedPlaylists) {
        playlists.push(await getPlaylist(playlistId));
    }

    switch (mergeType.value) {
    case EMergeType.BackToBack: {
        store.tracks = playlists.flat();

        if (removeDuplicates.value) {
            const trackIds = new Set<string>();
            store.tracks = store.tracks.filter((track) => {
                if (trackIds.has(track.id)) {
                    return false;
                }

                trackIds.add(track.id);
                return true;
            });
        }
    }
        break;
    case EMergeType.Interleaved: {

        const maxLength = Math.max(...playlists.map((playlist) => playlist.length));
        const trackIds = new Set<string>();

        for (let i = 0; i < maxLength; i++) {
            for (const playlist of playlists) {
                while (removeDuplicates.value && playlist[i] && trackIds.has(playlist[i].id)) {
                    playlist.splice(i, 1);
                }

                if (playlist[i]) {
                    store.tracks.push(playlist[i]);
                    trackIds.add(playlist[i].id);
                }
            }
        }
    }
        break;
    case EMergeType.Progress: {
        await generateProgress(playlists);
    }
    }

    if (targetDuration.value > 0) {
        while (store.tracks.reduce((acc, track) => acc + track.duration_ms, 0) > targetDuration.value * 60 * 1000) {
            store.tracks.splice(Math.floor(Math.random() * store.tracks.length), 1);
        }
    }

    await processTracks();
}

async function generateProgress(playlists: Array<Array<TTrack>>) {
    const tempTracks = [] as Array<{
        progress: number;
        track: TTrack;
    }>;

    const trackIds = new Set<string>();

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

    for (const track of tempTracks) {
        if (removeDuplicates.value && trackIds.has(track.track.id)) {
            tempTracks.splice(tempTracks.indexOf(track), 1);
            continue;
        }

        trackIds.add(track.track.id);
    }

    tempTracks.sort((a, b) => a.progress - b.progress);
    store.tracks = tempTracks.map((tempTrack) => tempTrack.track);
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

    .options {
        display: flex;
        gap: var(--fw-length-xs);

        .option {
            display: flex;
            gap: var(--fw-length-xs);
            flex-direction: column;
            width: 280px;

            .form {
                display: flex;
                gap: var(--fw-length-xs);
                align-items: center;

                .select, .time {
                    width: 200px;
                }
            }
        }
    }

    .time {
        width: 200px;
    }
}
</style>
