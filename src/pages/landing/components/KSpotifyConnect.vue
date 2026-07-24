<template>
    <div class="wrapper">
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
import { accessToken, disconnect } from "@/lib/spotify/local.ts";

function connect() {
    disconnect();
    requestAuthorization();
}

onMounted(async () => {
    if (accessToken.value) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
        const url = new URL(window.location.href);
        url.search = "";
        window.history.replaceState({}, "", url);

        try {
            await getToken(code, params.get("state"));
            alert("Connected to Spotify!");
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to connect to Spotify";
            alert(message);
        }
    }
});
</script>

<style scoped>
</style>
