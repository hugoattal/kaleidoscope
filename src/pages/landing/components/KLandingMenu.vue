<template>
    <div class="wrapper">
        <RouterLink to="/builder">
            <FButton icon="construction">
                Builder
            </FButton>
        </RouterLink>
        <RouterLink to="/player">
            <FButton icon="library_music">
                Player
            </FButton>
        </RouterLink>
        <FButton
            icon="power"
            @click="disconnect"
        >
            Disconnect
        </FButton>
    </div>
</template>

<script setup lang="ts">
import { FButton } from "@ferris-wheel/design";
import { disconnect } from "@/lib/spotify/local.ts";
</script>

<style scoped>
.wrapper {
    display: flex;
    gap: var(--fw-length-m);
}
</style>
