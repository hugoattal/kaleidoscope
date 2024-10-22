<template>
    <FBox
        class="playlists-viewer"
        :depth="-2"
    >
        <div
            v-if="store.selectedPlaylists.length === 0"
            class="playlist"
        >
            No playlist selected
        </div>
        <FBox
            v-for="(playlist, index) of store.selectedPlaylists"
            :key="index"
            class="playlist"
        >
            <div class="name">
                {{ playlistsById[playlist].name }}
            </div>
            <div class="actions">
                <FButton
                    icon="arrow_back"
                    :size="EElementSize.Small"
                    squared
                    @click="moveBack(index)"
                />

                <FButton
                    icon="arrow_forward"
                    :size="EElementSize.Small"
                    squared
                    @click="moveForward(index)"
                />
                <FButton
                    icon="delete"
                    :size="EElementSize.Small"
                    squared
                    @click="removePlaylist(index)"
                />
            </div>
        </FBox>
    </FBox>
</template>

<script setup lang="ts">
import { EElementSize, FBox, FButton } from "@ferris-wheel/design";
import { computed } from "vue";
import { store } from "@/lib/store.ts";

const playlistsById = computed(() => {
    return store.playlists.reduce((acc, playlist) => {
        acc[playlist.id] = playlist;
        return acc;
    }, {} as Record<string, { id: string; name: string }>);
});

function moveBack(index: number) {
    if (index === 0) {
        return;
    }

    const temp = store.selectedPlaylists[index];
    store.selectedPlaylists[index] = store.selectedPlaylists[index - 1];
    store.selectedPlaylists[index - 1] = temp;
}

function moveForward(index: number) {
    if (index === store.selectedPlaylists.length - 1) {
        return;
    }

    const temp = store.selectedPlaylists[index];
    store.selectedPlaylists[index] = store.selectedPlaylists[index + 1];
    store.selectedPlaylists[index + 1] = temp;
}

function removePlaylist(index: number) {
    store.selectedPlaylists.splice(index, 1);
}
</script>

<style scoped>
.playlists-viewer {
    padding: var(--fw-length-xs);
    width: 100%;
    display: flex;
    gap: var(--fw-length-xs);
    flex-wrap: wrap;

    .playlist {
        display: flex;
        padding: var(--fw-length-xxs) var(--fw-length-xs);
        gap: var(--fw-length-xs);
        align-items: center;

        .actions {
            display: flex;
            gap: var(--fw-length-xxs);
        }
    }
}
</style>
