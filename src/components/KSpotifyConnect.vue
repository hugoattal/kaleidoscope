<template>
    <button
        v-if="!accessToken"
        @click="connect"
    >
        Connect to Spotify
    </button>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { getToken, requestAuthorization } from "@/lib/spotify";
import { accessToken, authorizationCode } from "@/lib/spotify/local.ts";

function connect() {
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
