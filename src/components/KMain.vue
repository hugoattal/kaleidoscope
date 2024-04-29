<template>
    <KMenu />
    <KLayoutAnalyzer v-if="stateStore.current === EState.ANALYZER" />
    <KLayoutMixer v-if="stateStore.current === EState.MIXER" />
    <KLayoutMerger v-if="stateStore.current === EState.MERGER" />
</template>

<script setup lang="ts">

import KMenu from "@/components/KMenu.vue";
import KLayoutAnalyzer from "@/components/KLayoutAnalyzer.vue";
import { EState, stateStore } from "@/lib/stores/state.ts";
import KLayoutMerger from "@/components/KLayoutMerger.vue";
import KLayoutMixer from "@/components/KLayoutMixer.vue";
</script>

<style scoped>

</style>
