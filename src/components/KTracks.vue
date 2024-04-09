<template>
    <div v-if="store.playlistId">
        <table>
            <tr>
                <th>Name</th>
                <th>Artist</th>
                <th>Release</th>
                <th>Popularity</th>
                <th>Tempo</th>
                <th>Danceability</th>
                <th>Energy</th>
                <th>Valence</th>
            </tr>
            <tr
                v-for="track of store.tracks"
                :key="track.id"
                class="track"
            >
                <td>{{ track.name }}</td>
                <td>{{ track.artists[0].name }}</td>
                <td>{{ track.album.release_date }}</td>
                <td>
                    <KPercentageDisplay :value="track.popularity/100" />
                </td>
                <td>
                    <KPercentageDisplay
                        :max="200"
                        :min="50"
                        :value="track.features.tempo"
                    />
                </td>
                <td>
                    <KPercentageDisplay :value="track.features.danceability" />
                </td>
                <td>
                    <KPercentageDisplay :value="track.features.energy" />
                </td>
                <td>
                    <KPercentageDisplay :value="track.features.valence" />
                </td>
            </tr>
        </table>
    </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { store } from "@/lib/store.ts";
import { spotifyApi, spotifyApiList } from "@/lib/spotify/api.ts";
import KPercentageDisplay from "@/components/form/KPercentageDisplay.vue";

watch(() => store.playlistId, async (playlistId) => {
    if (!playlistId) {
        return;
    }

    store.tracks = (await spotifyApiList(`/playlists/${ playlistId }/tracks?fields=items(track(id,popularity,name,artists(name),album(release_date)))`)).map((item: any) => item.track);

    const features = (await spotifyApi(`/audio-features?ids=${ store.tracks.map((track) => track.id).join(",") }`)).audio_features;

    console.log({ features });

    store.tracks.forEach((track) => {
        const feature = features.find((feature: any) => feature.id === track.id);

        if (feature) {
            track.features = feature;
        }
    });
});
</script>

<style scoped>

</style>
