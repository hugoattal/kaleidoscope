<template>
    <KBackground class="bokeh" />
    <KEvents />
    <KPlayerMenu />
    <div
        class="content"
        :class="{'with-events': displayEvents}"
    >
        <img
            alt="RockIt Logo"
            class="logo"
            :src="RockItLogo"
        >
        <KTracklist />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import KBackground from "@/pages/player/components/KBackground.vue";
import RockItLogo from "@/assets/rockit.svg";
import { displayEvents, safeSyncQueue } from "@/lib/spotify/player.ts";
import KTracklist from "@/pages/player/components/KTracklist.vue";
import KPlayerMenu from "@/pages/player/components/KPlayerMenu.vue";
import KEvents from "@/pages/player/components/KEvents.vue";

onMounted(async () => {
    await safeSyncQueue();
});
</script>

<style scoped>
.bokeh {
    position: absolute;
    inset: 0;
}

.content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--fw-length-xl);

    &.with-events {
        padding-left: calc(280px + var(--fw-length-xxl));
    }

    .logo {
        width: 196px;
        filter: drop-shadow(0 8px 16px oklch(14% 0.0298 20.52));
    }
}
</style>

<style>
:root{
    --fw-config-primary-hue: 60deg;
    --fw-config-content-hue: 60deg;
}
</style>
