import {nextTracks} from "@/lib/spotify/player.ts";

const imageHandles = new Map<string, HTMLImageElement>(); // Keep a reference to the images so that they are not garbage collected

export function preloadAlbums() {
    for (const track of nextTracks.value) {
        const url = track.album.images[0].url;

        if (!imageHandles.has(url)) {
            const image = new Image();
            image.src = track.album.images[0].url;
            imageHandles.set(url, image);
        }
    }
}