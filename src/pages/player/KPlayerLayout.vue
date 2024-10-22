<template>
    <KBackground class="bokeh" />
    <div class="content">
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
import { syncQueue } from "@/lib/spotify/player.ts";
import KTracklist from "@/pages/player/components/KTracklist.vue";

onMounted(async () => {
    await syncQueue();
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
    padding: var(--fw-length-xl);

    .logo {
        width: 196px;
        filter: drop-shadow(0 8px 16px oklch(14% 0.0298 20.52));
    }
}
</style>

<style>
:root{
    --fw-config-primary-hue: 20deg;
    --fw-config-content-hue: 20deg;
}
</style>
