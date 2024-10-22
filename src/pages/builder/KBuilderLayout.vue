<template>
    <div class="layout">
        <KMenu />
        <KLayoutAnalyzer v-if="stateStore.current === EState.ANALYZER" />
        <KLayoutMixer v-if="stateStore.current === EState.MIXER" />
    </div>
</template>

<script setup lang="ts">
import KMenu from "@/pages/builder/components/KMenu.vue";
import KLayoutAnalyzer from "@/pages/builder/components/KLayoutAnalyzer.vue";
import { EState, stateStore } from "@/lib/stores/state.ts";
import KLayoutMixer from "@/pages/builder/components/KLayoutMixer.vue";
</script>

<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--fw-length-m);
    padding: var(--fw-length-m);
}
</style>
