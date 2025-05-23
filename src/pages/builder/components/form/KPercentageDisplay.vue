<template>
    <div class="percentage-display">
        <div
            class="percentage"
            :style="{ width, backgroundColor }"
        />
        <div class="value">
            {{ displayValue }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
    colorMax?: string;
    colorMin?: string;
    max?: number;
    min?: number;
    value: number;
}>(), {
    colorMax: "#0000bb",
    colorMin: "#770000",
    max: 1,
    min: 0
});

const width = computed(() => {
    return `${ (props.value - props.min) / (props.max - props.min) * 100 }%`;
});

const displayValue = computed(() => {
    if (props.max === 1) {
        return `${ Math.round(props.value * 100) }%`;
    }

    return Math.round(props.value);
});

const percentage = computed(() => {
    const raw = (props.value - props.min) / (props.max - props.min);
    return Math.min(1, Math.max(0, raw));
});

const backgroundColor = computed(() => {
    return `color-mix(in lch, ${ props.colorMax } ${ percentage.value * 100 }%, ${ props.colorMin })`;
});
</script>

<style scoped>
.percentage-display {
    width: 96px;
    height: 20px;
    position: relative;
    background: var(--fw-color-background-deep);
    border-radius: var(--fw-radius-s);
    overflow: hidden;
    border: 1px solid var(--fw-color-background-liter);

    .percentage {
        background-color: blue;
        height: 100%;
        position: absolute;
    }

    .value {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--fw-font-family-monospace);
        font-size: var(--fw-font-size-xs);
    }
}
</style>
