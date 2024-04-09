<template>
    <KSpotifyConnect />
    <template v-if="accessToken">
        <KPlaylistsList />
        <KTracks />
    </template>
</template>

<script setup lang="ts">
import KSpotifyConnect from "@/components/KSpotifyConnect.vue";
import { accessToken } from "@/lib/spotify/local.ts";
import KPlaylistsList from "@/components/KPlaylists.vue";
import KTracks from "@/components/KTracks.vue";
</script>

<style scoped>
</style>
