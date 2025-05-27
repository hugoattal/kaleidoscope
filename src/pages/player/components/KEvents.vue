<template>
<div class="events" v-if="displayEvent">
    Inscrivez-vous au
    <span class="title">Summer Danse Festival</span>
    Samedi 14 Juin 2025
    <span class="description">4 salles, plus de 700m², cours, soirée, shows...</span>
</div>
</template>

<script setup lang="ts">

import {displayEvent} from "@/lib/spotify/player.ts";
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bonheur+Royale&family=Yesteryear&display=swap');

.events {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    font-size: 28px;
    font-weight: 600;
    align-items: center;
    padding: var(--fw-length-xl);
    gap: var(--fw-length-xs);

    .description {
        font-size: 20px;
        font-weight: 400;
    }
}

.title {
    font-family: "Bonheur Royale", cursive;
    font-weight: 600;
    font-style: normal;
    font-size: 58px;
    color: var(--fw-color-content-deepest);
    text-shadow: 0 0 12px var(--fw-color-primary), 0 0 12px var(--fw-color-primary);
}

</style>