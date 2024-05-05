<template>
    <KMenu />
    <KLayoutAnalyzer v-if="stateStore.current === EState.ANALYZER" />
    <KLayoutMixer v-if="stateStore.current === EState.MIXER" />
</template>

<script setup lang="ts">

import KMenu from "@/components/KMenu.vue";
import KLayoutAnalyzer from "@/components/KLayoutAnalyzer.vue";
import { EState, stateStore } from "@/lib/stores/state.ts";
import KLayoutMixer from "@/components/KLayoutMixer.vue";
</script>

<style scoped>

</style>
