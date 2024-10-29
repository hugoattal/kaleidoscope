<template>
    <div class="feature-display">
        <div
            v-for="(block, key) of blocks"
            :key="key"
            class="value"
            :class="{shiny: isShiny}"
            :style="{opacity: block.display}"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
    colorMax?: string;
    colorMin?: string;
    max?: number;
    min?: number;
    steps?: number;
    value: number;
}>(), {
    max: 1,
    min: 0,
    steps: 5
});

const percentage = computed(() => {
    return Math.min(Math.max((props.value - props.min) / (props.max - props.min), 0.0001), 0.9999);
});

const blocks = computed(() => {
    return Array.from({ length: props.steps }, (_, index) => ({
        display: index < props.steps * percentage.value ? 1 : 0
    }));
});

const colorGradient = [
    "#5555ff",
    "#419bcc",
    "#1cb374",
    "#4dc116",
    "#fffe00"
];

const color = computed(() => {
    const index = Math.floor(props.steps * percentage.value);
    return colorGradient[index];
});

const isShiny = computed(() => {
    return percentage.value > 0.8;
});
</script>

<style scoped>
.feature-display {
    display: flex;
    width: 96px;
    height: 20px;
    position: relative;
    background: var(--fw-color-background);
    border-radius: var(--fw-radius-s);
    gap: var(--fw-length-xxs);

    .value {
        background-color: v-bind(color);
        height: 100%;
        flex: 1 1 auto;
        border-radius: var(--fw-radius-s);

        &.shiny {
            box-shadow: 0 0 8px v-bind(color);
        }
    }
}
</style>
