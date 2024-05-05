import { computeTotalDuration, store, TTrack } from "@/lib/store.ts";
import { Classifier } from "@/lib/sort/Classifier.ts";

export function shuffle() {
    const remaining = [...store.tracks];
    store.tracks = [];

    while (remaining.length) {
        const index = Math.floor(Math.random() * remaining.length);
        store.tracks.push(remaining.splice(index, 1)[0]);
    }

    computeTotalDuration();
}

export function autoSort() {
    const classifier = new Classifier(store.tracks);
    classifier.generateThresholds();

    const playlist = [] as Array<TTrack>;
    const totalTime = store.tracks.reduce((acc, track) => acc + track.duration_ms, 0);

    let time = 0;
    let track: TTrack;

    // Step 1: High energy, high popularity

    track = classifier.getSafeTrack(classifier.getTrack({
        filter: {
            energy: 1,
            popular: 1,
            retro: -1
        },
        limit: {
            energy: 0.8
        }
    }));

    time += track.duration_ms;
    playlist.push(track);

    // Step 2: High popularity/energy + alternate slow/fast

    let slow = false;
    let retro = false;

    while (time < totalTime * 0.1) {
        if (retro) {
            retro = false;
        }
        else {
            retro = Math.random() > 0.25;
        }

        track = classifier.getSafeTrack(classifier.getTrack({
            filter: {
                retro: retro ? 1 : -1,
                speed: slow ? -1 : 1
            },
            limit: {
                energy: 0.75,
                popular: 0.5,
                speed: 0.5
            }
        }));

        playlist.push(track);

        time += track.duration_ms;
        slow = !slow;
    }

    // Step 3: Exhaust retro tracks + alternate slow/fast

    classifier.generateThresholds();

    while (time < totalTime * 0.5) {
        if (retro) {
            retro = false;
        }
        else {
            retro = Math.random() > 0.25;
        }

        track = classifier.getSafeTrack(classifier.getTrack({
            filter: {
                retro: retro ? 1 : -1,
                speed: slow ? -1 : 1
            },
            limit: {
                energy: 0.75,
                popular: 0.75,
                retro: Math.random() > 0.5 ? 0.25 : 0,
                speed: Math.random() > 0.5 ? 0.5 : 0
            }
        }));

        playlist.push(track);

        time += track.duration_ms;
        slow = !slow;
    }

    // Step 4: Normal

    classifier.generateThresholds();

    while (time < totalTime * 0.8) {
        if (!retro) {
            retro = Math.random() > 0.25;
        }
        else {
            retro = false;
        }

        track = classifier.getSafeTrack(classifier.getTrack({
            filter: {
                retro: retro ? 1 : 0,
                speed: slow ? -1 : 1
            },
            limit: {
                energy: 0.75,
                popular: Math.random() > 0.5 ? 0.75 : 0,
                retro: Math.random() > 0.5 ? 0.25 : 0,
                speed: Math.random() > 0.5 ? 0.75 : 0
            }
        }));

        playlist.push(track);

        time += track.duration_ms;
        slow = !slow;
    }

    // Step 5: Fill the rest

    classifier.generateThresholds();

    while (classifier.tracks.length) {
        track = classifier.getSafeTrack(classifier.getTrack({
            filter: {
                speed: slow ? -1 : 1
            },
            limit: {
            }
        }));

        playlist.push(track);

        time += track.duration_ms;
        slow = !slow;
    }

    store.tracks = playlist;
    computeTotalDuration();
}
