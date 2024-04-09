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
    max?: number;
    min?: number;
    value: number;
}>(), {
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

const backgroundColor = computed(() => {
    return `color-mix(in lch, #0000bb ${ (props.value - props.min) / (props.max - props.min) * 100 }%, #990000)`;
});
</script>

<style scoped>
.percentage-display {
    width: 96px;
    height: 20px;
    position: relative;
    background: rgba(0,0,0,0.25);

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
        font-family: monospace;
    }
}
</style>
