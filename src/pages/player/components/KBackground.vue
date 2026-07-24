<template>
    <div
        ref="wrapper"
        class="canvas-wrapper"
    >
        <canvas
            ref="canvas"
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
const MAX_FRAME_DELTA = 50;
const BOKEH_SPRITE_SIZE = 256;

let stopHandle: () => void;
let bokehSprite: HTMLCanvasElement;

const expectedBokehs = computed(() => Math.min(MAX_BOKEHS, Math.floor((wrapperBounding.width.value * wrapperBounding.height.value) * DENSITY)));

onMounted(() => {
    bokehSprite = createBokehSprite();
    stopHandle = animationLoop(drawLoop);
});

onUnmounted(() => {
    stopHandle();
});

function drawLoop(delta: number) {
    generateBokehs();
    updateBokehs(Math.min(delta, MAX_FRAME_DELTA));
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

function createBokehSprite() {
    const sprite = document.createElement("canvas");
    sprite.width = BOKEH_SPRITE_SIZE;
    sprite.height = BOKEH_SPRITE_SIZE;

    const ctx = sprite.getContext("2d")!;
    const center = BOKEH_SPRITE_SIZE / 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, "rgba(242, 146, 0, 0.6)");
    gradient.addColorStop(0.8, "rgba(242, 146, 0, 0.8)");
    gradient.addColorStop(0.9, "rgba(242, 146, 0, 1)");
    gradient.addColorStop(1, "rgba(242, 146, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, BOKEH_SPRITE_SIZE, BOKEH_SPRITE_SIZE);

    return sprite;
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
    const speedMultiplier = Number(particleSpeed.value);
    if (!Number.isFinite(speedMultiplier)) return;

    const speed = BOKEH_SPEED * props.speed * delta * (60 / 1000) / wrapperBounding.height.value * speedMultiplier;

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
    const canvasElement = canvas.value;
    if (!canvasElement) return;

    const width = wrapperBounding.width.value;
    const height = wrapperBounding.height.value;
    const pixelRatio = window.devicePixelRatio;
    const pixelWidth = Math.round(width * pixelRatio);
    const pixelHeight = Math.round(height * pixelRatio);

    if (canvasElement.width !== pixelWidth || canvasElement.height !== pixelHeight) {
        canvasElement.width = pixelWidth;
        canvasElement.height = pixelHeight;
    }

    const ctx = canvasElement.getContext("2d")!;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    for (const bokeh of bokehs) {
        const radius = bokeh.radius;

        ctx.globalAlpha = bokeh.opacity;
        ctx.drawImage(
            bokehSprite,
            bokeh.x * width - radius,
            bokeh.y * height - radius,
            radius * 2,
            radius * 2
        );
    }

    ctx.globalAlpha = 1;
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
        width: 100%;
        height: 100%;
    }
}
</style>
