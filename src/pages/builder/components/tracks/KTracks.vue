<template>
    <div class="tracks-wrapper">
        <table>
            <tr class="head">
                <th colspan="4" />
                <th class="big">
                    Name
                </th>
                <th class="big">
                    Artist
                </th>
                <th class="value">
                    Release
                </th>
            </tr>
            <KTrack
                v-for="(track, index) of store.tracks"
                :key="track.id"
                :index="index"
                :track="track"
            />
        </table>
        <div class="buttons">
            <FButton
                v-if="store.selectedPlaylist"
                icon="save"
                @click="savePlaylist"
            >
                Save playlist
            </FButton>
            <FButton
                icon="publish"
                @click="exportPlaylist"
            >
                Export playlist
            </FButton>
            <FButton
                icon="shuffle"
                @click="shuffle"
            >
                Shuffle
            </FButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FButton } from "@ferris-wheel/design";

import { shuffle } from "@/lib/sort";
import { createPlaylist, saveToPlaylist } from "@/lib/spotify/playlist.ts";
import { store } from "@/lib/store.ts";
import KTrack from "@/pages/builder/components/tracks/KTrack.vue";

async function savePlaylist() {
    const trackIds = store.tracks.map((track) => track.id);
    await saveToPlaylist(store.selectedPlaylist, trackIds);

    alert("Playlist saved!");
}

async function exportPlaylist() {
    if (store.tracks.length === 0) {
        alert("No tracks to export!");
        return;
    }

    let playlistName = prompt("Enter playlist name");

    if (playlistName === null) {
        return;
    }

    playlistName ||= "KS Export";

    const trackIds = store.tracks.map((track) => track.id);
    await createPlaylist(playlistName, trackIds);

    alert("Playlist exported!");
}
</script>

<style scoped>
.tracks-wrapper {
    display: flex;
    width: 100%;
    justify-content: center;
}

table {
    border-spacing: 0;

    th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: var(--fw-color-background-lite);
    }

    tr:nth-child(odd) {
        background: var(--fw-color-background-lite);
    }

    th, :deep(td) {
        padding: var(--fw-length-xs);
        text-align: left;
    }

    th.value {
        width: 96px;
    }

    :deep(.big) {
        width: 192px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.buttons {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: var(--fw-length-xs);
    top: var(--fw-length-m);
    right: var(--fw-length-m);
    z-index: 10;

    button {
        justify-content: left;
    }
}
</style>
