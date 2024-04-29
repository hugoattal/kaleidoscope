<template>
    <div class="connect-wrapper">
        <div class="header">
            <div class="title">
                Kaleidoscope
            </div>
            <div class="subtitle">
                A Spotify Playlist Manager
            </div>
        </div>
        <FButton
            icon="power"
            @click="connect"
        >
            Connect to Spotify
        </FButton>
    </div>
</template>

<script setup lang="ts">
import { FButton } from "@ferris-wheel/design";
import { onMounted } from "vue";
import { getToken, requestAuthorization } from "@/lib/spotify";
import { accessToken, authorizationCode } from "@/lib/spotify/local.ts";

function connect() {
    authorizationCode.value = "";
    accessToken.value = "";

    requestAuthorization();
}

onMounted(async () => {
    if (accessToken.value) {
        return;
    }

    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
        authorizationCode.value = code;
        await getToken();
        alert("Connected to Spotify!");
    }
});
</script>

<style scoped>
.connect-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--fw-length-xl);
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 450px;

    .title {
        font-size: 3rem;
        font-weight: bold;
        color: var(--fw-color-content-deepest);
        text-shadow: 0 0 32px var(--fw-color-primary);
    }

    .header {
        display: flex;
        flex-direction: column;
        gap: var(--fw-length-xs);
        align-items: center;
    }
}
</style>
