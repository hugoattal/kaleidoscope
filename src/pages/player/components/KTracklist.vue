<template>
    <div class="tracklist-wrapper">
        <TransitionGroup
            class="tracklist"
            name="list"
            tag="div"
        >
            <div
                v-for="item in tracklistItems"
                :key="item.id"
                :class="item.kind === 'track' ? ['track', item.type] : 'section-title'"
            >
                <template v-if="item.kind === 'track'">
                    <div class="cover">
                        <img
                            alt="Album cover"
                            :src="item.data.album.images[0]?.url"
                        >
                    </div>
                    <div class="content">
                        <div
                            class="title"
                            translate="no"
                        >
                            <span class="name">{{ item.data.name }}</span>
                            <span class="time">{{ displayTime(item.data.duration_ms) }}</span>
                        </div>
                        <div
                            class="artist"
                            translate="no"
                        >
                            {{ item.data.artists[0].name }}
                        </div>
                        <KPlaybar v-if="item.type === 'current'" />
                    </div>
                    <div
                        v-if="item.type !== 'current'"
                        class="position"
                    >
                        {{ item.position }}
                    </div>
                </template>
                <template v-else>
                    {{ item.label }}
                </template>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { currentTrack, nextTracks, previousTracks } from "@/lib/spotify/player.ts";
import type { TTrack } from "@/lib/store.ts";
import KPlaybar from "@/pages/player/components/KPlaybar.vue";

type TTracklistItem = {
    id: string;
    data: TTrack;
    kind: "track";
    position: number;
    type: "last" | "current" | "next";
};

type TTracklistSection = {
    id: string;
    kind: "section";
    label: string;
};

const lastTracks = computed(() => previousTracks.value.slice(-2));
const comingTracks = computed(() => nextTracks.value.slice(0, 6));

const tracklistItems = computed<Array<TTracklistItem | TTracklistSection>>(() => {
    const result: Array<TTracklistItem | TTracklistSection> = [];
    const ids = new Set<string>();

    function getId(id: string) {
        if (!ids.has(id)) {
            ids.add(id);
            return id;
        }

        return getId(`${ id }x`);
    }

    function addSection(id: string, label: string) {
        result.push({
            id,
            kind: "section",
            label
        });
    }

    function addTrack(data: TTrack, position: number, type: TTracklistItem["type"]) {
        result.push({
            id: getId(data.id),
            data,
            kind: "track",
            position,
            type
        });
    }

    if (lastTracks.value.length) {
        addSection("section-last", "Récemment");

        for (const [index, track] of lastTracks.value.entries()) {
            addTrack(track, index - lastTracks.value.length, "last");
        }
    }

    if (currentTrack.value) {
        addSection("section-current", "En cours");
        addTrack(currentTrack.value, 0, "current");
    }

    if (comingTracks.value.length) {
        addSection("section-next", "À suivre");

        for (const [index, track] of comingTracks.value.entries()) {
            addTrack(track, index + 1, "next");
        }
    }

    return result;
});

function displayTime(time: number): string {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${ minutes }:${ seconds.toString().padStart(2, "0") }`;
}
</script>

<style scoped>
.tracklist-wrapper {
    --track-background: color-mix(in srgb, var(--fw-color-background-deepest) 53%, transparent);
    --track-background-muted: color-mix(in srgb, var(--fw-color-background-deepest) 50%, transparent);
    --track-border: var(--fw-color-primary-deepest);
    --track-shadow: color-mix(in srgb, var(--fw-color-background-deepest) 53%, transparent);
    --track-position-background: var(--fw-color-primary);
    --track-position-size: 2.25rem;

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: var(--fw-length-xl) 0;
}

.tracklist {
    width: 60vw;
    display: grid;
    gap: var(--fw-length-s);
    position: relative;
    grid-template-columns: 1fr 1fr;

    .section-title {
        grid-column: 1 / -1;
        color: var(--fw-color-content-deep);
        font-size: 18px;
        font-weight: bold;
        transition:
            opacity 0.5s ease,
            transform 0.5s ease;
    }

    .track {
        display: flex;
        backdrop-filter: blur(16px);
        background: var(--track-background);
        border-radius: var(--fw-length-m);
        box-shadow: 0 8px 16px var(--track-shadow);
        position: relative;
        transition:
            background-color 0.5s ease,
            border-color 0.5s ease,
            border-radius 0.5s ease,
            opacity 0.5s ease,
            transform 0.5s ease;
        border: 1px solid var(--track-border);
        overflow: hidden;

        &.current {
            grid-column: span 2;
            box-shadow: 0 0 16px var(--fw-color-primary-deepest);
        }

        &.list-leave-active {
            position: absolute;
        }

        .content {
            display: flex;
            padding: var(--fw-length-m);
            flex: 1 1 auto;
            min-width: 0;
            flex-direction: column;
            gap: var(--fw-length-xs);
            transition: opacity 0.5s ease;
        }

        .artist, .title {
            transition:
                color 0.5s ease,
                font-size 0.5s ease;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .title {
            display: flex;
            align-items: baseline;
            gap: var(--fw-length-s);
            font-size: 42px;
            font-weight: bold;
            color: var(--fw-color-content-deepest);

            .name {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .time {
                flex: none;
                margin-left: auto;
                font-weight: normal;
                font-size: 0.75em;
                font-variant-numeric: tabular-nums;
                color: var(--fw-color-content-lite);
            }
        }

        .artist {
            font-size: 28px;
            color: var(--fw-color-content-deep);
        }

        .position {
            position: absolute;
            right: var(--fw-length-s);
            bottom: var(--fw-length-s);
            padding: 0 var(--fw-length-xs);
            border: 1px solid var(--fw-color-primary-liter);
            border-radius: var(--fw-radius-m);
            background: var(--track-position-background);
            color: var(--fw-color-background-deepest);
            font-size: var(--fw-font-size-m);
            font-weight: bold;
        }

        .cover {
            flex: 0 0 160px;
            transition:
                flex-basis 0.5s ease,
                height 0.5s ease,
                opacity 0.5s ease,
                width 0.5s ease;
            width: 160px;
            height: 160px;
            position: relative;

            img {
                transition: border-radius 0.5s ease;
                width: 100%;
            }
        }
    }

    .next, .last {
        border-radius: var(--fw-length-m);
        background: var(--track-background-muted);
        border-color: var(--fw-color-content-softer);

        .content {
            opacity: 0.5;
            gap: var(--fw-length-xs);
        }

        .title {
            font-size: 28px;
        }

        .artist {
            font-size: 18px;
        }

        .cover {
            flex: 0 0 96px;
            width: 96px;
            height: 96px;
            opacity: 0.5;

            img {
                border-radius: var(--fw-radius-s);
            }
        }
    }
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
}
</style>
