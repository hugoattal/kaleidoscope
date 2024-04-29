<template>
    <FBox
        class="merger-wrapper"
        :depth="-2"
    >
        <div class="name">
            Select at least two playlists to merge
        </div>
        <div class="actions">
            <FSelect
                v-model="mergeType"
                class="select"
                :options="dropdownOptions"
            />
            <FButton @click="generate">
                Generate
            </FButton>
        </div>
    </FBox>
</template>

<script setup lang="ts">
import { FBox, FButton, FSelect } from "@ferris-wheel/design";
import { ref } from "vue";
import { store } from "@/lib/store.ts";
import { spotifyApiList } from "@/lib/spotify/api.ts";
import { processTracks } from "@/lib/spotify/track.ts";

enum EMergeType {
    BackToBack = "BackToBack",
    Interleaved = "Interleaved",
    Random = "Random"
}

const dropdownOptions = [
    { id: EMergeType.BackToBack, label: "Back to back" },
    { id: EMergeType.Interleaved, label: "Interleaved" },
    { id: EMergeType.Random, label: "Random" }
];

const mergeType = ref<EMergeType>(EMergeType.BackToBack);

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

    switch (mergeType.value) {
    case EMergeType.BackToBack:
        store.tracks = playlists.flat();
        break;
    case EMergeType.Interleaved: {

        const maxLength = Math.max(...playlists.map((playlist) => playlist.length));

        for (let i = 0; i < maxLength; i++) {
            for (const playlist of playlists) {
                if (playlist[i]) {
                    store.tracks.push(playlist[i]);
                }
            }
        }
    }
        break;
    case EMergeType.Random: {
        store.tracks = playlists.flat().sort(() => Math.random() - 0.5);
    }
    }

    await processTracks();
}
</script>

<style scoped>
.merger-wrapper {
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
    }

    .select {
        width: 200px;
    }
}
</style>
