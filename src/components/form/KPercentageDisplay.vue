<template>
    <div class="percentage-display">
        <div
            class="percentage"
            :style="{ width: `${ props.percentage * 100 }%`, backgroundColor }"
        />
        <div class="value">
            {{ Math.round(props.percentage * 100) }}%
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    percentage: number;
}>();

const backgroundColor = computed(() => {
    return `color-mix(in lch, #0000bb ${ props.percentage * 100 }%, #990000)`;
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
