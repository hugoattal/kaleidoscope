<template>
    <KPlaylistsList />
    <KTracks />
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";

import { getPlaylist } from "@/lib/spotify/cache.ts";
import { processTracks } from "@/lib/spotify/track.ts";
import { store } from "@/lib/store.ts";
import KPlaylistsList from "@/pages/builder/components/playlist/KPlaylists.vue";
import KTracks from "@/pages/builder/components/tracks/KTracks.vue";

onMounted(async () => {
    store.tracks = [];
});

watch(() => store.selectedPlaylist, async (playlistId) => {
    if (!playlistId) {
        return;
    }

    store.tracks = await getPlaylist(playlistId);

    processTracks();
}, {
    flush: "sync"
});
</script>

<style scoped>

</style>
