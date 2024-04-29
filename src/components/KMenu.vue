<template>
    <div class="menu-wrapper">
        <div class="title">
            Kaleidoscope
        </div>
        <FButtonGroup
            v-model="stateStore.current"
            :options="options"
        />
    </div>
</template>

<script setup lang="ts">
import { FButtonGroup, TIconOptions } from "@ferris-wheel/design";
import { EState, stateStore } from "@/lib/stores/state.ts";

const options: TIconOptions = [
    {
        id: EState.ANALYZER,
        icon: "monitoring",
        label: "Analyzer"
    },
    {
        id: EState.MIXER,
        icon: "blender",
        label: "Mixer"
    },
    {
        id: EState.MERGER,
        icon: "merge",
        label: "Merger"
    }
];
</script>

<style scoped>
.menu-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;

    .title {
        position: absolute;
        left: 0;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--fw-color-content-deepest);
        text-shadow: 0 0 16px var(--fw-color-primary);
    }
}
</style>
