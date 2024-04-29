<template>
    <FBox
        class="playlists-wrapper"
        :depth="-2"
    >
        <div class="name">
            Playlists selection
        </div>
        <div class="playlists">
            <div
                v-for="playlist of store.playlists"
                :key="playlist.id"
                class="playlist"
            >
                <FButton
                    :icon="store.selectedPlaylists.has(playlist.id) ? 'check_box' : 'check_box_outline_blank'"
                    :type="store.selectedPlaylists.has(playlist.id) ? EElementType.Primary : EElementType.Default"
                    @click="toggle(playlist.id)"
                >
                    {{ playlist.name }}
                </FButton>
            </div>
        </div>
    </FBox>
</template>

<script setup lang="ts">
import { EElementType, FBox, FButton } from "@ferris-wheel/design";
import { onMounted } from "vue";
import { spotifyApiList } from "@/lib/spotify/api.ts";
import { userId } from "@/lib/spotify/local.ts";
import { store } from "@/lib/store.ts";

onMounted(async () => {
    store.playlists = await spotifyApiList(`/users/${ userId.value }/playlists`);
});

function toggle(playlistId: string) {
    if (store.selectedPlaylists.has(playlistId)) {
        store.selectedPlaylists.delete(playlistId);
    }
    else {
        store.selectedPlaylists.add(playlistId);
    }
}
</script>

<style scoped>
.playlists-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--fw-length-xs);
    width: 100%;
    padding: var(--fw-length-xs);

    .name {
        text-transform: uppercase;
        font-size: 0.8rem;
    }
}

.playlists {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fw-length-xs);
}
</style>
