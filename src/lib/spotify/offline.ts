import { nextTracks } from "@/lib/spotify/player.ts";

const imageHandles = new Map<string, HTMLImageElement>(); // Keep a reference to the images so that they are not garbage collected

export function preloadAlbums() {
    for (const track of nextTracks.value) {
        const image = track.album.images[0];

        if (image && !imageHandles.has(image.url)) {
            const imageHandle = new Image();
            imageHandle.src = image.url;
            imageHandles.set(image.url, imageHandle);
        }
    }
}
