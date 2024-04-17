import { TTrack } from "@/lib/store.ts";

export class Classifier {
    tracks: Array<TTrack> = [];
    thresholds: {
        energy: number;
        popular: number;
        retro: number;
        speed: number;
    } = {
            energy: 0,
            popular: 0,
            retro: 0,
            speed: 0
        };

    constructor(tracks: Array<TTrack>) {
        this.tracks = [...tracks];
    }

    generateThresholds() {
        this.tracks.sort((a, b) => a.popularity - b.popularity);
        this.thresholds.popular = this.tracks[Math.floor(this.tracks.length * 0.5)].popularity;

        this.tracks.sort((a, b) => a.features.energy - b.features.energy);
        this.thresholds.energy = this.tracks[Math.floor(this.tracks.length * 0.5)].features.energy!;

        this.tracks.sort((a, b) => a.features.tempo - b.features.tempo);
        this.thresholds.speed = this.tracks[Math.floor(this.tracks.length * 0.5)].features.tempo!;

        this.tracks.sort((a, b) => a.album.release_date.localeCompare(b.album.release_date));
        this.thresholds.retro = new Date(this.tracks[Math.floor(this.tracks.length * 0.5)].album.release_date).getFullYear();
    }

    removeTrack(track: TTrack) {
        this.tracks.splice(this.tracks.indexOf(track), 1);
    }

    getTrack(options: {
        filter: {
            energy?: -1 | 1 | 0;
            popular?: -1 | 1 | 0;
            retro?: -1 | 1 | 0;
            speed?: -1 | 1 | 0;
        };
        limit: {
            energy?: number;
            popular?: number;
            retro?: number;
            speed?: number;
        };
    }) {
        let result = [...this.tracks];

        if (options.filter.retro) {
            const temporary = result.filter(track => new Date(track.album.release_date).getFullYear() * options.filter.retro <= this.thresholds.retro * options.filter.retro);
            result = temporary.length ? temporary : result;
        }

        if (options.filter.speed) {
            const temporary = result.filter(track => track.features.tempo * options.filter.speed >= this.thresholds.speed * options.filter.speed);
            result = temporary.length ? temporary : result;
        }

        if (options.filter.popular) {
            const temporary = result.filter(track => track.popularity * options.filter.popular >= this.thresholds.popular * options.filter.popular);
            result = temporary.length ? temporary : result;
        }

        if (options.filter.energy) {
            const temporary = result.filter(track => track.features.energy * options.filter.energy >= this.thresholds.energy * options.filter.energy);
            result = temporary.length ? temporary : result;
        }

        if (options.limit.retro) {
            result.sort((a, b) => (new Date(a.album.release_date).getFullYear() - new Date(b.album.release_date).getFullYear()) * options.limit.retro);
            const limit = Math.floor(result.length * Math.abs(options.limit.retro));
            result.length = limit || 1;
        }

        if (options.limit.speed) {
            result.sort((a, b) => (b.features.tempo - a.features.tempo) * options.limit.speed);
            const limit = Math.floor(result.length * Math.abs(options.limit.speed));
            result.length = limit || 1;
        }

        if (options.limit.popular) {
            result.sort((a, b) => (b.popularity - a.popularity) * options.limit.popular);
            const limit = Math.floor(result.length * Math.abs(options.limit.popular));
            result.length = limit || 1;
        }

        if (options.limit.energy) {
            result.sort((a, b) => (b.features.energy - a.features.energy) * options.limit.energy);
            const limit = Math.floor(result.length * Math.abs(options.limit.energy));
            result.length = limit || 1;
        }

        return result[Math.floor(result.length * Math.random())];
    }

    getSafeTrack(track?: TTrack) {
        const result = track ?? this.tracks[Math.floor(this.tracks.length * Math.random())];
        this.removeTrack(result);
        return result;
    }
}
