<template>
    <FBody class="body">
        <RouterView />
    </FBody>
</template>

<script setup lang="ts">
import { FBody } from "@ferris-wheel/design";
</script>

<style>
@import "@ferris-wheel/design/dist/style.css" layer(ferris-wheel);

:root, :host {
    --fw-config-radius: 8px;
}

html, body {
    margin: 0;
    background: var(--fw-color-background);
    font-family: var(--fw-font-family);
    color: var(--fw-color-content);
}

.body {
    min-height: 100vh;
    height: 0; /* For children to use 100% height */
}
</style>
