<template>
    <div class="menu">
        <FButton
            icon="refresh"
            @click="refresh"
        >
            Manual trigger
        </FButton>
    </div>
</template>

<script setup lang="ts">
import { FButton } from "@ferris-wheel/design";
import { syncQueue } from "@/lib/spotify/player.ts";

async function refresh() {
    await syncQueue();
}
</script>

<style scoped>
.menu {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    position: absolute;
    padding: var(--fw-length-m);
    z-index: 1;
    top: 0;
    right: 0;

    &:hover {
        opacity: 1;
    }
}
</style>
