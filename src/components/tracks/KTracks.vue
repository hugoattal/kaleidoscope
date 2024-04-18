<template>
    <div
        v-if="store.playlistId"
        class="tracks-wrapper"
    >
        <table>
            <tr class="head">
                <th colspan="4" />
                <th class="big">
                    Name
                </th>
                <th class="big">
                    Artist
                </th>
                <th>Release</th>
                <th>Popularity</th>
                <th>Tempo</th>
                <th>Dance</th>
                <th>Energy</th>
                <th>Positive</th>
            </tr>
            <KTrack
                v-for="(track, index) of store.tracks"
                :key="track.id"
                :index="index"
                :track="track"
            />
        </table>
        <div class="buttons">
            <FButton
                icon="save"
                @click="savePlaylist"
            >
                Save playlist
            </FButton>
            <FButton
                icon="category"
                @click="autoSort"
            >
                Smart sort
            </FButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FButton } from "@ferris-wheel/design";
import { watch } from "vue";
import { computeTotalDuration, store } from "@/lib/store.ts";
import { spotifyApi, spotifyApiList } from "@/lib/spotify/api.ts";
import KTrack from "@/components/tracks/KTrack.vue";
import { autoSort } from "@/lib/sort";

watch(() => store.playlistId, async (playlistId) => {
    if (!playlistId) {
        return;
    }

    store.tracks = (await spotifyApiList(`/playlists/${ playlistId }/tracks?fields=next,items(track(id,popularity,name,artists(name),duration_ms,album(release_date,images(url))))`)).map((item: any) => item.track);

    const features = [];

    for (let i = 0; i < store.tracks.length; i += 100) {
        features.push(...(await spotifyApi(`/audio-features?ids=${ store.tracks.slice(i, i + 100).map((track) => track.id).join(",") }`)).audio_features);
    }

    store.tracks.forEach((track) => {
        const feature = features.find((feature: any) => feature.id === track.id);

        if (feature) {
            track.features = feature;
        }
    });

    computeTotalDuration();
}, {
    flush: "sync"
});

async function savePlaylist() {
    const trackIds = store.tracks.map((track) => track.id);

    for (let i = 0; i < store.tracks.length; i += 100) {
        const response = await spotifyApi(`/playlists/${ store.playlistId }/tracks`, {
            body: JSON.stringify({ tracks: trackIds.map((id) => ({ uri: `spotify:track:${ id }` })) }),
            method: "DELETE"
        });

        if (response.error) {
            alert(`Error: ${ response.error.message }`);
            return;
        }
    }

    for (let i = 0; i < store.tracks.length; i += 100) {
        const response = await spotifyApi(`/playlists/${ store.playlistId }/tracks`, {
            body: JSON.stringify({ uris: trackIds.slice(i, i + 100).map((id) => `spotify:track:${ id }`) }),
            method: "POST"
        });

        if (response.error) {
            alert(`Error: ${ response.error.message }`);
            return;
        }
    }

    alert("Playlist saved!");
}
</script>

<style scoped>
.tracks-wrapper {
    display: flex;
    width: 100%;
    justify-content: center;
}

table {
    border-spacing: 0;

    th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: var(--fw-color-background-lite);
    }

    tr:nth-child(odd) {
        background: var(--fw-color-background-lite);
    }

    th, :deep(td) {
        padding: var(--fw-length-xs);
        text-align: left;
    }

    :deep(.big) {
        width: 192px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.buttons {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: var(--fw-length-xs);
    top: var(--fw-length-m);
    right: var(--fw-length-m);

    button {
        justify-content: left;
    }
}
</style>
