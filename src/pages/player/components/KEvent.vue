<template>
    <div class="event">
        <div class="banner">
            <div class="gradient" />
        </div>
        <div class="content">
            <div class="title">
                {{ title }}
            </div>
            <div class="date">
                {{ formattedDate }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { TEvent } from "@/pages/player/lib/api.ts";

const props = defineProps<{
    event: TEvent
}>();

const title = computed(() => {
    const prefix = props.event.attributes.titlePrefix || props.event.attributes.eventType.data.attributes.defaultTitlePrefix || "";
    const suffix = props.event.attributes.titleSuffix || props.event.attributes.eventType.data.attributes.defaultTitleSuffix || "";
    return `${ prefix } ${ suffix }`.trim();
});

const banner = computed(() => {
    const url = props.event.attributes.banner?.data.attributes.url || props.event.attributes.eventType.data.attributes.defaultBanner.data.attributes.url;
    return `url(${ url })`;
});

const formattedDate = computed(() => {
    const date = new Date(props.event.attributes.startAt);
    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        month: "long",
        weekday: "long",
        year: "numeric"
    }).format(date);
});
</script>

<style scoped>
.event {
    width: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(16px);
    border-radius: var(--fw-length-l);
    overflow: hidden;
    background: #1c0b0b88;
    position: relative;
    box-shadow: 0 8px 16px #13050588;
    border: 1px solid var(--fw-color-content-softest);

    .banner {
        width: 100%;
        aspect-ratio: 2.2;
        background-size: cover;
        background-position: center;
        background-image: v-bind(banner);
        opacity: 0.33;
        position: relative;

        .gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, #00000000, #00000000 20%, #000000bb);
        }
    }

    .content {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: var(--fw-length-m);
        gap: var(--fw-length-s);
    }

    .title {
        font-size: var(--fw-font-size-m);
        font-weight: bold;
        text-shadow: 0 0 16px black;
        color: var(--fw-color-content-deeper);
    }

    .date {
        font-size: var(--fw-font-size-m);
        text-shadow: 0 0 16px black;
        color: var(--fw-color-content-deep);

        &:first-letter {
            text-transform: uppercase;
        }
    }
}
</style>
