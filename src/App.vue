<template>
    <FBody class="body">
        <div class="wrapper">
            <KSpotifyConnect />
            <template v-if="accessToken">
                <KPlaylistsList />
                <KTracks />
            </template>
        </div>
    </FBody>
</template>

<script setup lang="ts">
import { FBody } from "@ferris-wheel/design";
import KSpotifyConnect from "@/components/KSpotifyConnect.vue";
import { accessToken } from "@/lib/spotify/local.ts";
import KPlaylistsList from "@/components/KPlaylists.vue";
import KTracks from "@/components/tracks/KTracks.vue";
</script>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--fw-length-m);
    padding: var(--fw-length-m);
}
</style>

<style>
@import "@ferris-wheel/design/dist/style.css" layer(ferris-wheel);

:root, :host {
    --fw-config-radius: 8px;
}

html, body {
    margin: 0;
    background: var(--fw-color-background);
    font-family: var(--fw-font-family);
    color: var(--fw-color-content);
}

.body {
    min-height: 100vh;
    height: 0; /* For children to use 100% height */
}
</style>
