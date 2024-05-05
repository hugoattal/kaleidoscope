<template>
    <KPlaylistsMultiple />
    <KPlaylistsViewer />
    <KMixer />
    <KTracks />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import KPlaylistsMultiple from "@/components/playlist/KPlaylistsMultiple.vue";
import KTracks from "@/components/tracks/KTracks.vue";
import KMixer from "@/components/features/KMixer.vue";
import { store } from "@/lib/store.ts";
import KPlaylistsViewer from "@/components/playlist/KPlaylistsViewer.vue";

onMounted(async () => {
    store.tracks = [];
});
</script>

<style scoped>

</style>
