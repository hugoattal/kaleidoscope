<template>
    <div class="playlists">
        <div
            v-for="playlist of playlists"
            :key="playlist.id"
            class="playlist"
        >
            <button @click="select(playlist.id)">
                Select
            </button> {{ playlist.name }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { spotifyApiList } from "@/lib/spotify/api.ts";
import { userId } from "@/lib/spotify/local.ts";
import { store } from "@/lib/store.ts";

const playlists = ref<Array<{
    id: string;
    name: string;
}>>([]);

onMounted(async () => {
    playlists.value = await spotifyApiList(`/users/${ userId.value }/playlists`);
});

function select(playlistId: string) {
    store.playlistId = playlistId;
}
</script>

<style scoped>

</style>
