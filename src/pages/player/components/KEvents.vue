<template>
    <aside
        v-if="displayEvents"
        :aria-busy="isLoading"
        aria-labelledby="events-title"
        class="events"
    >
        <h2
            id="events-title"
            class="title"
        >
            Prochains événements
        </h2>
        <p
            v-if="isLoading"
            class="status"
            role="status"
        >
            Chargement des événements…
        </p>
        <p
            v-else-if="loadError"
            class="status"
            role="alert"
        >
            Les événements sont momentanément indisponibles.
        </p>
        <p
            v-else-if="events.length === 0"
            class="status"
        >
            Aucun événement à venir.
        </p>
        <ul
            v-else
            class="list"
        >
            <li
                v-for="event in events"
                :key="event.id"
            >
                <KEvent :event="event" />
            </li>
        </ul>
    </aside>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { displayEvents } from "@/lib/spotify/player.ts";
import KEvent from "@/pages/player/components/KEvent.vue";
import type { TEvent } from "@/pages/player/lib/api.ts";

type TEventsResponse = {
    data: Array<TEvent>;
};

const events = ref<Array<TEvent>>([]);
const isLoading = ref(true);
const loadError = ref(false);

async function loadEvents() {
    try {
        const apiUrl = new URL(import.meta.env.VITE_STRAPI_API_URL);
        apiUrl.pathname = "/api/events";

        const searchParams = apiUrl.searchParams;
        searchParams.set("status", "published");
        searchParams.set("sort", "startAt");
        searchParams.set("pagination[pageSize]", "4");
        searchParams.set("filters[endAt][$gt]", new Date().toISOString());
        searchParams.set("populate[banner]", "true");
        searchParams.set("populate[eventType][populate][defaultBanner]", "true");

        const request = await fetch(apiUrl.toString(), {
            headers: {
                "Authorization": `Bearer ${ import.meta.env.VITE_STRAPI_TOKEN }`,
                "Content-Type": "application/json"
            }
        });

        if (!request.ok) {
            throw new Error(`Unable to load events: ${ request.status }`);
        }

        const response = await request.json() as TEventsResponse;

        events.value = response.data;
    }
    catch {
        loadError.value = true;
    }
    finally {
        isLoading.value = false;
    }
}

onMounted(loadEvents);
</script>

<style scoped>
.events {
    position: absolute;
    inset: 0 auto 0 0;
    display: flex;
    flex-direction: column;
    width: min(calc(var(--player-events-width) + var(--fw-length-xxl)), 100vw);
    padding: var(--fw-length-xl);
    gap: var(--fw-length-l);
    box-sizing: border-box;
    overflow: hidden;

    .title {
        display: flex;
        align-items: center;
        margin: 0;
        gap: var(--fw-length-s);
        font-weight: bold;
        font-style: normal;
        font-size: var(--fw-font-size-l);
        color: color-mix(
            in lch,
            var(--fw-color-content-deeper) 88%,
            var(--fw-color-primary)
        );
        letter-spacing: 0.015em;
        text-shadow: 0 0 12px color-mix(in lch, var(--fw-color-primary) 12%, transparent);
    }

    .list {
        min-height: 0;
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        gap: var(--fw-length-m);
        overflow-y: auto;
        scrollbar-color: color-mix(in lch, var(--fw-color-primary) 28%, transparent) transparent;
        scrollbar-width: thin;
    }

    .status {
        margin: 0;
        padding: var(--fw-length-m);
        color: var(--fw-color-content-deep);
        background: color-mix(in lch, var(--fw-color-background-deep) 80%, transparent);
        border: 1px solid color-mix(
            in lch,
            var(--fw-color-primary) 28%,
            var(--fw-color-content-softest)
        );
        border-radius: var(--fw-length-l);
        backdrop-filter: blur(16px);
    }
}
</style>
