<template>
    <div class="playbar">
        <div class="cursor" />
        <div class="remaining">
            <span>{{ remainingDisplay }}</span> restant
        </div>
    </div>
</template>

<script setup lang="ts">

import { currentTrack, progressMs, syncKey, syncQueue } from "@/lib/spotify/player.ts";
import { computed, ref, watch } from "vue";
import { useNow, whenever } from "@vueuse/core";

const currentProgressMs = ref(0);
const startWatch = ref(0);

watch(() => [progressMs.value, currentTrack.value, syncKey.value], () => {
    currentProgressMs.value = progressMs.value;
    startWatch.value = Date.now();
}, { immediate: true });

const remaining = computed(() => {
    const now = useNow({ interval: 1000 });
    return currentTrack.value!.duration_ms - (currentProgressMs.value + (now.value - startWatch.value));
});

const remainingDisplay = computed(() => {
    const safeRemaining = Math.max(remaining.value, 0);
    const minutes = Math.floor(safeRemaining / 60000);
    const seconds = Math.floor((safeRemaining % 60000) / 1000);
    return `${ minutes }:${ seconds.toString().padStart(2, "0") }`;
});

const cursorWidth = computed(() => {
    const now = useNow({ interval: 1000 });
    const progress = currentProgressMs.value + (now.value - startWatch.value);
    return `${ (progress / currentTrack.value!.duration_ms) * 100 }%`;
});

whenever(() => remaining.value <= 0, async () => {
    const currentTrackId = currentTrack.value!.id;

    for (let tryCount = 0; tryCount < 5; tryCount++) {
        await sleep(1000);
        await syncQueue();
        if (currentTrack.value!.id !== currentTrackId) {
            return;
        }
    }
});

async function sleep(time = 1000) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
</script>

<style scoped>
.playbar {
    background: var(--fw-color-background);
    border-radius: var(--fw-radius-m);
    width: 100%;
    height: 20px;
    margin-top: var(--fw-length-xs);
    position: relative;
    box-sizing: border-box;

    .cursor {
        transition: width 1s linear;
        width: min(max(v-bind(cursorWidth), 20px), 100%);
        border-radius: var(--fw-radius-m);
        height: 100%;
        background: linear-gradient(90deg, #ff0004, #fcfa01);
        box-shadow: 0 0 8px #f29200, 0 0 32px #f2920055;
    }

    .remaining {
        position: absolute;
        right: 0;
        top: -24px;
        font-size: var(--fw-font-size-m);
        color: var(--fw-color-content-lite);
    }
}
</style>
