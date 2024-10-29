<template>
    <div
        ref="wrapper"
        class="canvas-wrapper"
    >
        <canvas
            ref="canvas"
            :height="wrapperBounding.height.value"
            :width="wrapperBounding.width.value"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useElementSize } from "@vueuse/core";
import { animationLoop } from "@/pages/player/lib/animation.ts";
import { backgroundColor, particleSpeed } from "@/pages/player/lib/store.ts";

const props = withDefaults(defineProps<{
    speed?: number;
}>(), {
    speed: 1
});

const canvas = ref<HTMLCanvasElement>();
const wrapper = ref<HTMLElement>();
const wrapperBounding = useElementSize(wrapper);

const DENSITY = 1 / 20000;
const MAX_BOKEHS = 1000;
const BOKEH_SPEED = 5;

let stopHandle: () => void;

const expectedBokehs = computed(() => Math.min(MAX_BOKEHS, Math.floor((wrapperBounding.width.value * wrapperBounding.height.value) * DENSITY)));

onMounted(() => {
    stopHandle = animationLoop(drawLoop);
});

onUnmounted(() => {
    stopHandle();
});

function drawLoop(delta: number) {
    generateBokehs();
    updateBokehs(delta);
    drawBokehs();
}

type TBokeh = {
    opacity: number;
    radius: number;
    x: number;
    y: number;
};

const bokehs: Array<TBokeh> = [];

function randomSize() {
    return -Math.log(1 - Math.random() * 0.99) * 20 + 20;
}

function randomOpacity() {
    return -Math.log(1 - Math.random() * 0.99) * 0.1 + 0.1;
}

function generateBokehs() {
    while (bokehs.length < expectedBokehs.value) {
        bokehs.push({
            opacity: randomOpacity(),
            radius: randomSize(),
            x: Math.random(),
            y: Math.random() * 2 - 0.5
        });
    }

    while (bokehs.length > expectedBokehs.value) {
        bokehs.pop();
    }
}

function updateBokehs(delta: number) {
    const speed = BOKEH_SPEED * props.speed * delta * (60 / 1000) / wrapperBounding.height.value * particleSpeed.value;

    for (const bokeh of bokehs) {
        bokeh.y -= speed / bokeh.radius;

        if (bokeh.y < -0.5) {
            bokeh.y = 1.5;
            bokeh.x = Math.random();
            bokeh.radius = randomSize();
            bokeh.opacity = randomOpacity();
        }
    }
}

function drawBokehs() {
    const ctx = canvas.value?.getContext("2d");
    if (!ctx) return;

    const width = canvas.value!.width;
    const height = canvas.value!.height;

    ctx.clearRect(0, 0, width, height);

    for (const bokeh of bokehs) {


        const gradient = ctx.createRadialGradient(bokeh.x * width, bokeh.y * height, 0, bokeh.x * width, bokeh.y * height, bokeh.radius);
        gradient.addColorStop(0, `rgba(242, 146, 0, ${ bokeh.opacity * 0.6 })`);
        gradient.addColorStop(0.8, `rgba(242, 146, 0, ${ bokeh.opacity * 0.8 })`);
        gradient.addColorStop(0.9, `rgba(242, 146, 0, ${ bokeh.opacity })`);
        gradient.addColorStop(1, `rgba(242, 146, 0, 0)`);

        ctx.fillStyle = "#f2920044";
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(bokeh.x * width, bokeh.y * height, bokeh.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
</script>

<style scoped>
.canvas-wrapper {
    position: absolute;
    inset: 0;
    background: v-bind(backgroundColor);

    canvas {
        position: absolute;
        inset: 0;
    }
}
</style>
