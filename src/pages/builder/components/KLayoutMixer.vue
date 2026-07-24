<template>
    <KPlaylistsMultiple />
    <KPlaylistsViewer />
    <KMixer />
    <KTracks />
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import { store } from "@/lib/store.ts";
import KMixer from "@/pages/builder/components/features/KMixer.vue";
import KPlaylistsMultiple from "@/pages/builder/components/playlist/KPlaylistsMultiple.vue";
import KPlaylistsViewer from "@/pages/builder/components/playlist/KPlaylistsViewer.vue";
import KTracks from "@/pages/builder/components/tracks/KTracks.vue";

onMounted(async () => {
    store.tracks = [];
});
</script>

<style scoped>

</style>
