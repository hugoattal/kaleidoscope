<template>
    <div
        v-if="displayEvents"
        class="events"
    >
        <div class="title">
            Prochains événements
        </div>
        <KEvent
            v-for="event in events"
            :key="event.id"
            :event="event"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { displayEvents } from "@/lib/spotify/player.ts";
import KEvent from "@/pages/player/components/KEvent.vue";
import type { TEvent } from "@/pages/player/lib/api.ts";

const events = ref<Array<TEvent>>([]);

onMounted(async () => {
    const apiUrl = new URL(import.meta.env.VITE_STRAPI_API_URL);
    apiUrl.pathname = "/api/events";

    const searchParams = apiUrl.searchParams;
    // Strapi v5 : sans `status=published`, l'API renvoie draft + published
    // → chaque event dupliqué ("tourne en boucle"). Cf migration v4 → v5.
    searchParams.set("status", "published");
    searchParams.set("sort", "startAt");
    searchParams.set("pagination[pageSize]", "5");
    // endAt est un datetime ISO côté Strapi : comparer à une date ISO, pas à un ms.
    searchParams.set("filters[endAt][$gt]", new Date().toISOString());
    // populate imbriqué : deux `set("populate", ...)` s'écrasaient (set, pas append)
    // → seul le dernier était pris en compte. Syntaxe v5 par clés imbriquées.
    searchParams.set("populate[banner]", "true");
    searchParams.set("populate[eventType][populate][defaultBanner]", "true");

    const request = await fetch(apiUrl.toString(), {
        headers: {
            "Authorization": `Bearer ${ import.meta.env.VITE_STRAPI_TOKEN }`,
            "Content-Type": "application/json"
        }
    });

    const response = await request.json();

    events.value = response.data;
});
</script>

<style scoped>
.events {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    padding: var(--fw-length-xl);
    gap: var(--fw-length-m);

    .title {
        font-weight: bold;
        font-style: normal;
        font-size: var(--fw-font-size-l);
        color: var(--fw-color-content-deep);
        text-shadow: 0 0 12px var(--fw-color-primary);
    }
}
</style>
