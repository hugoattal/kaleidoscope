<template>
    <tr
        v-if="isReady"
        class="track"
        :class="{dragging: isDraggable}"
        :draggable="isDraggable"
        @dragend="dragEnd"
        @dragstart="dragStart"
    >
        <td
            class="drag"
            @mousedown.stop="handleGrab"
        >
            <FIcon icon="drag_indicator" />
        </td>
        <td class="index">
            {{ index+1 }}
        </td>
        <td class="time">
            {{ displayTime(track.total_duration) }}
        </td>
        <td class="cover">
            <div class="cover-wrapper">
                <img
                    alt="Album cover"
                    :src="track.album.images[0]?.url"
                >
            </div>
        </td>
        <td>
            <div
                class="big"
                :title="track.name"
            >
                {{ track.name }}
            </div>
        </td>
        <td>
            <div
                class="big"
                :title="track.artists[0].name"
            >
                {{ track.artists[0].name }}
            </div>
        </td>
        <td>
            <KPercentageDisplay
                :max="2025"
                :min="1980"
                :value="getYear(track.album.release_date)"
            />
        </td>
        <td>
            <KPercentageDisplay :value="track.popularity/100" />
        </td>
        <td>
            <KPercentageDisplay
                :max="160"
                :min="80"
                :value="track.features.tempo"
            />
        </td>
        <td>
            <KPercentageDisplay :value="track.features.danceability" />
        </td>
        <td>
            <KPercentageDisplay :value="track.features.energy" />
        </td>
        <td>
            <KPercentageDisplay :value="track.features.valence" />
        </td>
        <div
            v-if="moveStore.moveSource"
            class="drop-zone before"
            :class="{hover: dragHover === 'before'}"
            @dragenter="dragEnter('before')"
            @dragleave="dragLeave('before')"
            @dragover.prevent
            @drop="dragDrop('before')"
        >
            <div class="insert-line" />
        </div>
        <div
            v-if="moveStore.moveSource"
            class="drop-zone after"
            :class="{hover: dragHover === 'after'}"
            @dragenter="dragEnter('after')"
            @dragleave="dragLeave('after')"
            @dragover.prevent
            @drop="dragDrop('after')"
        >
            <div class="insert-line" />
        </div>
    </tr>
    <tr v-else>
        <td colspan="4" />
        <td>
            <div class="big">
                {{ track.name }}
            </div>
        </td>
        <td :colspan="7">
            Loading...
        </td>
    </tr>
</template>

<script setup lang="ts">
import { FIcon } from "@ferris-wheel/design";
import { computed, ref } from "vue";
import KPercentageDisplay from "@/components/form/KPercentageDisplay.vue";
import { computeTotalDuration, moveStore, store, TTrack } from "@/lib/store.ts";

type TDropInsertion = "before" | "after" ;

const props = defineProps<{
    index: number;
    track: TTrack;
}>();

const isReady = computed(() => props.track.album && props.track.artists && props.track.features);

function getYear(date: string) {
    return new Date(date).getFullYear();
}

const isDraggable = ref(false);

function handleGrab() {
    isDraggable.value = true;
}

function dragStart() {
    moveStore.moveSource = props.track.id;
}

function dragEnd() {
    isDraggable.value = false;
    moveStore.moveSource = "";
}

const dragHover = ref("");

function dragEnter(position: TDropInsertion) {
    dragHover.value = position;
}

function dragLeave(position: TDropInsertion) {
    if (dragHover.value === position) {
        dragHover.value = "";
    }
}

function dragDrop(position: TDropInsertion) {
    if (moveStore.moveSource !== props.track.id) {
        const trackIndex = store.tracks.findIndex((track) => track.id === moveStore.moveSource);
        const track = store.tracks[trackIndex];
        store.tracks.splice(trackIndex, 1);

        const targetIndex = store.tracks.findIndex((track) => track.id === props.track.id);
        store.tracks.splice(targetIndex + (position === "before" ? 0 : 1), 0, track);
        computeTotalDuration();
    }

    dragHover.value = "";
    isDraggable.value = false;
    moveStore.moveSource = "";
}

function displayTime(ms: number) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);

    return `${ hours }:${ minutes.toString().padStart(2, "0") }`;
}
</script>

<style scoped>
.track {
    position: relative;

    &.dragging {
        background: var(--fw-color-primary-deepest);
    }

    .index, .time {
        text-align: right;
        color: var(--fw-color-content-liter);
        font-size: var(--fw-font-size-xs);
        font-family: var(--fw-font-family-monospace);
    }

    .cover {
        padding: 0 var(--fw-length-xs);

        .cover-wrapper {
            display: flex;
            justify-content: center;
            height: 100%;
        }

        img {
            width: 24px;
            height: 24px;
            border-radius: var(--fw-radius-s);
        }
    }

    .drag {
        color: var(--fw-color-content-litest);
        cursor: grab;

        &:hover {
            color: var(--fw-color-content-lite);
        }
    }

    .drop-zone {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;

        &.before {
            bottom: 50%;
        }

        &.after {
            top: 50%;
        }

        .insert-line {
            width: 100%;
            height: 4px;
            pointer-events: none;
        }

        &.hover {
            background: color-mix(in lch, var(--fw-color-primary) 25%, transparent);

            .insert-line {
                background: var(--fw-color-primary);
            }
        }
    }
}
</style>
