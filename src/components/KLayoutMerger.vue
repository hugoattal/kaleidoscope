<template>
    <KPlaylistsMultiple />
    <KMerger />
    <KTracks />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import KPlaylistsMultiple from "@/components/playlist/KPlaylistsMultiple.vue";
import KMerger from "@/components/features/KMerger.vue";
import KTracks from "@/components/tracks/KTracks.vue";
import { store } from "@/lib/store.ts";

onMounted(async () => {
    store.tracks = [];
});
</script>

<style scoped>

</style>
