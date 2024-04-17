<template>
    <div class="playlists-wrapper">
        <div>
            Step 2: Select a playlist
        </div>
        <div class="playlists">
            <div
                v-for="playlist of playlists"
                :key="playlist.id"
                class="playlist"
            >
                <FButton @click="select(playlist.id)">
                    {{ playlist.name }}
                </FButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FButton } from "@ferris-wheel/design";
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
.playlists-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--fw-length-xs);
}

.playlists {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fw-length-xs);
}
</style>
