<template>
    <KPlaylistsList />
    <KTracks />
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import KPlaylistsList from "@/components/playlist/KPlaylists.vue";
import KTracks from "@/components/tracks/KTracks.vue";
import { store } from "@/lib/store.ts";
import { spotifyApiList } from "@/lib/spotify/api.ts";
import { processTracks } from "@/lib/spotify/track.ts";

onMounted(async () => {
    store.tracks = [];
});

watch(() => store.selectedPlaylist, async (playlistId) => {
    if (!playlistId) {
        return;
    }

    store.tracks = (await spotifyApiList(`/playlists/${ playlistId }/tracks?fields=next,items(track(id,popularity,name,artists(name),duration_ms,album(release_date,images(url))))`)).map((item: any) => item.track);

    await processTracks();
}, {
    flush: "sync"
});
</script>

<style scoped>

</style>
