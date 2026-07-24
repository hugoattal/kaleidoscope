import { reactive } from "vue";

export type TTrack = {
    id: string;
    name: string;
    album: {
        images: Array<{
            url: string;
        }>;
        release_date: string;
    };
    artists: Array<{
        name: string;
    }>;
    duration_ms: number;
    total_duration: number;
    type: "track";
};

export const store = reactive({
    playlists: [] as Array<{ id: string; name: string; }>,
    selectedPlaylist: "",
    selectedPlaylists: [] as Array<string>,
    tracks: [] as Array<TTrack>
});

export const moveStore = reactive({
    moveSource: ""
});

export function computeTotalDuration() {
    let totalDuration = 0;

    for (const track of store.tracks) {
        totalDuration += track.duration_ms;
        track.total_duration = totalDuration;
    }
}
