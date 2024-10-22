<template>
    <div class="layout">
        <div class="header">
            <div class="title">
                Kaleidoscope
            </div>
            <div class="subtitle">
                Cool Spotify playlist manager and player
            </div>
        </div>
        <KLandingMenu v-if="accessToken" />
        <KSpotifyConnect v-else />
    </div>
</template>

<script setup lang="ts">
import { accessToken } from "@/lib/spotify/local.ts";
import KSpotifyConnect from "@/pages/landing/components/KSpotifyConnect.vue";
import KLandingMenu from "@/pages/landing/components/KLandingMenu.vue";
</script>

<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    gap: var(--fw-length-xl);
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 450px;

    .title {
        font-size: 3rem;
        font-weight: bold;
        color: var(--fw-color-content-deepest);
        text-shadow: 0 0 32px var(--fw-color-primary);
    }

    .header {
        display: flex;
        flex-direction: column;
        gap: var(--fw-length-xs);
        align-items: center;
    }
}
</style>
