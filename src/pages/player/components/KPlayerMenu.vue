<template>
    <div class="menu">
        <FButton
            icon="event"
            @click="toggleEvent"
        >
            Toggle event
        </FButton>
        <FButtonGroup
            v-model="backgroundColor"
            :options="backgroundColorOptions"
        />
        <FButtonGroup
            v-model="particleSpeed"
            :options="particleSpeedOptions"
        />
        <FButton
            icon="refresh"
            @click="manualSync"
            :disabled="syncing"
        >
            Manual sync
        </FButton>
        <FButton
            icon="refresh"
            @click="offlineSync"
            :type="playerStore.offline ? EElementType.Primary : EElementType.Default"
        >
            Offline sync
        </FButton>
    </div>
</template>

<script setup lang="ts">
import {EElementType, FButton, FButtonGroup, TIconOptions} from "@ferris-wheel/design";
import {displayEvent, safeSyncQueue, syncing} from "@/lib/spotify/player.ts";
import {backgroundColor, particleSpeed, playerStore} from "@/pages/player/lib/store.ts";

async function manualSync() {
    await safeSyncQueue();
}

async function offlineSync() {
    if (playerStore.offline) {
        playerStore.offline = false;
        return;
    }

    playerStore.offline = true;
    await safeSyncQueue();
}

function toggleEvent() {
    displayEvent.value = !displayEvent.value;
}

const particleSpeedOptions: TIconOptions = [
    {
        id: "0",
        icon: "stop",
        label: "Stop"
    },
    {
        id: "1",
        icon: "play_arrow",
        label: "Normal"
    },
    {
        id: "2",
        icon: "fast_forward",
        label: "Fast"
    }
];

const backgroundColorOptions: TIconOptions = [
    {
        id: "#1c0b0b",
        icon: "light_mode",
        label: "Normal"
    },
    {
        id: "#130505",
        icon: "cloud",
        label: "Dark"
    },
    {
        id: "#000000",
        icon: "dark_mode",
        label: "Darker"
    }
];
</script>

<style scoped>
.menu {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    position: absolute;
    padding: var(--fw-length-m);
    z-index: 1;
    top: 0;
    right: 0;
    display: flex;
    gap: var(--fw-length-m);

    &:hover {
        opacity: 1;
    }
}
</style>
