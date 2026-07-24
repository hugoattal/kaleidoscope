<template>
    <article class="event">
        <div
            aria-hidden="true"
            class="banner"
        />
        <div class="content">
            <h3 class="title">
                <span class="title-prefix">{{ titlePrefix }}</span>
                {{ " " }}
                <span
                    v-if="titleSuffix"
                    class="title-suffix"
                >
                    {{ titleSuffix }}
                </span>
            </h3>
            <time
                class="date"
                :datetime="event.startAt"
            >
                {{ formattedDate }}
            </time>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { TEvent } from "@/pages/player/lib/api.ts";

const dayFormatter = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    weekday: "short"
});

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
});

const props = defineProps<{
    event: TEvent;
}>();

const titlePrefix = computed(() => (
    props.event.titlePrefix || props.event.eventType?.defaultTitlePrefix || ""
));

const titleSuffix = computed(() => (
    props.event.titleSuffix || props.event.eventType?.defaultTitleSuffix || ""
));

const banner = computed(() => {
    const url = props.event.banner?.url || props.event.eventType?.defaultBanner?.url || "";
    return url ? `url("${ url }")` : "none";
});

const formattedDate = computed(() => {
    const date = new Date(props.event.startAt);
    const formatted = `${ dayFormatter.format(date) } · ${ timeFormatter.format(date) }`;
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
});
</script>

<style scoped>
.event {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(16px);
    border-radius: var(--fw-length-l);
    overflow: hidden;
    position: relative;
    border: 1px solid color-mix(
        in lch,
        var(--fw-color-content-softest) 82%,
        var(--fw-color-primary-deepest)
    );

    .banner {
        width: 100%;
        aspect-ratio: 2.33 / 1;
        background-size: cover;
        background-position: center;
        background-image: v-bind(banner);
        filter: saturate(0.82) brightness(0.86) contrast(1.03);
    }

    .content {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: var(--fw-length-m);
        gap: var(--fw-length-s);
        background:
            radial-gradient(
                circle at 0 100%,
                color-mix(in lch, var(--fw-color-primary) 6%, transparent),
                transparent 45%
            ),
            linear-gradient(
                180deg,
                transparent 10%,
                color-mix(in lch, var(--fw-color-background-deep) 96%, transparent) 48%,
                var(--fw-color-background-deep) 100%
            );
        text-shadow: 0 2px 4px var(--fw-color-background-deep);
    }

    .title {
        display: -webkit-box;
        margin: 0;
        overflow: hidden;
        font-size: var(--fw-font-size-l);
        font-weight: bold;
        line-height: 1.2;
        color: var(--fw-color-content-deeper);
        letter-spacing: 0.01em;
        text-wrap: balance;

        .title-suffix {
            color: color-mix(
                in lch,
                var(--fw-color-content-deeper) 84%,
                var(--fw-color-primary)
            );
            font-weight: 600;
        }
    }

    .date {
        width: 100%;
        display: flex;
        align-items: center;
        gap: var(--fw-length-xs);
        font-size: var(--fw-font-size-m);
        font-weight: 500;
        color: color-mix(
            in lch,
            var(--fw-color-content-deeper) 72%,
            var(--fw-color-primary)
        );
        letter-spacing: 0.02em;
    }
}
</style>
