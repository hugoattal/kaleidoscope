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
</style>
