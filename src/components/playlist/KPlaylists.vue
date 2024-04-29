<template>
    <FBox
        class="playlists-wrapper"
        :depth="-2"
    >
        <div class="filter">
            <FTextInput
                v-model="filter"
                icon="search"
                placeholder="Filter playlists"
            />
        </div>
        <div class="playlists">
            <div
                v-for="playlist of filteredPlaylists"
                :key="playlist.id"
                class="playlist"
            >
                <FButton
                    :icon="store.selectedPlaylist === playlist.id ? 'radio_button_checked' : 'radio_button_unchecked'"
                    :type="store.selectedPlaylist === playlist.id ? EElementType.Primary : EElementType.Default"
                    @click="select(playlist.id)"
                >
                    {{ playlist.name }}
                </FButton>
            </div>
        </div>
    </FBox>
</template>

<script setup lang="ts">
import { EElementType, FBox, FButton, FTextInput } from "@ferris-wheel/design";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { spotifyApiList } from "@/lib/spotify/api.ts";
import { userId } from "@/lib/spotify/local.ts";
import { store } from "@/lib/store.ts";

onMounted(async () => {
    store.playlists = await spotifyApiList(`/users/${ userId.value }/playlists`);
});

function select(playlistId: string) {
    store.selectedPlaylist = playlistId;
}

const filter = ref("");

const filteredPlaylists = computed(() => {
    return store.playlists.filter((playlist) => playlist.name.toLowerCase().includes(filter.value.toLowerCase()));
});

onUnmounted(() => {
    store.selectedPlaylist = "";
});
</script>

<style scoped>
.playlists-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--fw-length-xs);
    width: 100%;
    padding: var(--fw-length-xs);
}

.playlists {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fw-length-xs);
    max-height: 280px;
    overflow: auto;
}
</style>
