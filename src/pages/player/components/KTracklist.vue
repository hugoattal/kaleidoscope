<template>
    <div class="tracklist-wrapper">
        <TransitionGroup
            class="tracklist"
            name="list"
            tag="div"
        >
            <div
                v-for="track in tracks"
                :key="track.id"
                class="track"
                :class="track.type"
            >
                <div class="cover">
                    <img
                        alt="Album cover"
                        :src="track.data.album.images[0]?.url"
                    >
                    <div
                        v-if="track.type !== 'current'"
                        class="position"
                    >
                        {{ track.position }}
                    </div>
                </div>
                <div class="content">
                    <div
                        class="title"
                        translate="no"
                    >
                        <span class="time">[{{ displayTime(track.data.duration_ms) }}]</span>
                        {{ track.data.name }}
                    </div>
                    <div
                        class="artist"
                        translate="no"
                    >
                        {{ track.data.artists[0].name }}
                    </div>
                    <KPlaybar v-if="track.type === 'current'" />
                </div>
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
    position: number;
    type: "last" | "current" | "next";
};

const lastTracks = computed(() => previousTracks.value.slice(-2));
const comingTracks = computed(() => nextTracks.value.slice(0, 6));

const tracks = computed<Array<TTracklistItem>>(() => {
    const result: Array<TTracklistItem> = [];
    const ids = new Set<string>();

    function getId(id: string) {
        if (!ids.has(id)) {
            ids.add(id);
            return id;
        }

        return getId(`${ id }x`);
    }

    function addTrack(data: TTrack, position: number, type: TTracklistItem["type"]) {
        result.push({
            id: getId(data.id),
            data,
            position,
            type
        });
    }

    for (const [index, track] of lastTracks.value.entries()) {
        addTrack(track, index - lastTracks.value.length, "last");
    }

    if (currentTrack.value) {
        addTrack(currentTrack.value, 0, "current");
    }

    for (const [index, track] of comingTracks.value.entries()) {
        addTrack(track, index + 1, "next");
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
    --track-background-muted: color-mix(in srgb, var(--fw-color-background-deepest) 27%, transparent);
    --track-border: color-mix(in srgb, var(--fw-color-primary) 33%, transparent);
    --track-shadow: color-mix(in srgb, var(--fw-color-background-deepest) 53%, transparent);

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: var(--fw-length-xl) 0;
}

.tracklist {
    width: 60vw;
    display: grid;
    gap: var(--fw-length-l);
    position: relative;
    grid-template-columns: 1fr 1fr;

    .current {
        grid-column: span 2;
    }

    .track {
        display: flex;
        column-gap: var(--fw-length-m);
        backdrop-filter: blur(16px);
        background: var(--track-background);
        padding: var(--fw-length-m);
        border-radius: var(--fw-length-xl);
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

        &.list-leave-active {
            position: absolute;
        }

        .content {
            display: flex;
            flex: 1 1 auto;
            flex-direction: column;
            gap: var(--fw-length-s);
            transition: opacity 0.5s ease;
        }

        .artist, .title {
            transition:
                color 0.5s ease,
                font-size 0.5s ease;
            white-space: nowrap;
        }

        .title {
            font-size: 32px;
            font-weight: bold;
            color: var(--fw-color-content-deepest);

            .time {
                font-weight: normal;
                color: var(--fw-color-content-liter);
            }
        }

        .artist {
            font-size: 28px;
            color: var(--fw-color-content-deep);
        }

        .cover {
            flex: 0 0 128px;
            transition:
                flex-basis 0.5s ease,
                height 0.5s ease,
                opacity 0.5s ease,
                width 0.5s ease;
            width: 128px;
            height: 128px;
            position: relative;

            img {
                transition: border-radius 0.5s ease;
                border-radius: var(--fw-radius-l);
                width: 100%;
            }

            .position {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--fw-font-size-xxl);
                text-shadow: 0 0 16px black, 0 0 8px black;
                font-weight: bold;
                color: var(--fw-color-content-deepest);
            }
        }
    }

    .next, .last {
        border-radius: var(--fw-length-l);
        background: var(--track-background-muted);
        border-color: var(--fw-color-content-softest);

        .content {
            opacity: 0.5;
            gap: var(--fw-length-xs);
        }

        .title {
            font-size: 22px;
        }

        .artist {
            font-size: 18px;
        }

        .cover {
            flex: 0 0 64px;
            width: 64px;
            height: 64px;
            opacity: 0.5;

            img {
                border-radius: var(--fw-radius-m);
            }
        }
    }
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
}
</style>
