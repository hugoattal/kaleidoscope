<template>
    <TransitionGroup
        class="tracklist"
        name="list"
        tag="div"
    >
        <div
            v-for="track in tracks"
            :key="track.data.id"
            class="track"
            :class="track.type"
        >
            <div class="cover">
                <img
                    alt="Album cover"
                    :src="track.data.album.images[0]?.url"
                >
            </div>
            <div class="content">
                <div class="title">
                    <span class="name">{{ track.data.name }}</span> (<span class="artist">{{
                        track.data.artists[0].name
                    }}</span>)
                </div>
                <div
                    v-if="track.data.features"
                    class="features"
                >
                    <div class="feature-wrapper">
                        <span>Tempo (<strong>{{ Math.round(track.data.features.tempo) }}</strong> BPM)</span>
                        <KPercentageDisplay
                            class="feature"
                            color-max="#fcfa01"
                            color-min="#550004"
                            :max="160"
                            :min="80"
                            :value="track.data.features.tempo"
                        />
                    </div>
                    <div class="feature-wrapper">
                        <span>Popularité</span>
                        <KPercentageDisplay
                            class="feature"
                            color-max="#fcfa01"
                            color-min="#550004"
                            :value="track.data.popularity/100"
                        />
                    </div>
                    <div class="feature-wrapper">
                        <span>Danceabilité</span>
                        <KPercentageDisplay
                            class="feature"
                            color-max="#fcfa01"
                            color-min="#550004"
                            :value="track.data.features.danceability"
                        />
                    </div>
                    <div class="feature-wrapper">
                        <span>Énergie</span>
                        <KPercentageDisplay
                            class="feature"
                            color-max="#fcfa01"
                            color-min="#550004"
                            :value="track.data.features.energy"
                        />
                    </div>
                </div>
                <KPlaybar v-if="track.type === 'current'" />
            </div>
            <div class="description">
                {{ track.description }}
            </div>
        </div>
    </TransitionGroup>
</template>

<script setup lang="ts">
import { currentTrack, nextTracks, previousTracks } from "@/lib/spotify/player.ts";
import { computed } from "vue";
import KPercentageDisplay from "@/pages/builder/components/form/KPercentageDisplay.vue";
import { TTrack } from "@/lib/store.ts";
import KPlaybar from "@/pages/player/components/KPlaybar.vue";

const lastTrack = computed(() => previousTracks.value.at(-1));
const comingTracks = computed(() => nextTracks.value.slice(0, 3));

const tracks = computed(() => {
    const result: Array<{ type: string; data: TTrack; description: string; }> = [];

    if (lastTrack.value) {
        result.push({
            type: "last",
            data: lastTrack.value,
            description: "Dernière"
        });
    }

    if (currentTrack.value) {
        result.push({
            type: "current",
            data: currentTrack.value,
            description: "En cours"
        });
    }

    for (const [index, track] of comingTracks.value.entries()) {
        result.push({
            type: "next",
            data: track,
            description: `Prochaine ${ index + 1 }`
        });
    }

    return result;
});
</script>

<style scoped>
.tracklist {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--fw-length-l);
    margin: var(--fw-length-xl) 0;
    position: relative;

    .track {
        display: flex;
        column-gap: var(--fw-length-m);
        backdrop-filter: blur(16px);
        background: #1c0b0b88;
        padding: var(--fw-length-m);
        border-radius: var(--fw-length-xl);
        width: 60%;
        box-shadow: 0 8px 16px #13050588;
        position: relative;
        transition: all 0.5s ease;
        border: 1px solid #f2920055;

        &.list-leave-active {
            position: absolute;
        }

        .content {
            display: flex;
            flex: 1 1 auto;
            flex-direction: column;
            gap: var(--fw-length-s);
        }

        .title {
            transition: all 0.5s ease;
            font-size: 28px;
            color: var(--fw-color-content-lite);

            .name {
                transition: all 0.5s ease;
                font-size: 32px;
                font-weight: bold;
                color: var(--fw-color-content-deeper);
            }
        }

        .cover {
            transition: all 0.5s ease;
            width: 128px;
            height: 128px;

            img {
                transition: all 0.5s ease;
                border-radius: var(--fw-radius-l);
                width: 100%;
            }
        }

        .features {
            display: flex;
            gap: var(--fw-length-m);

            .feature-wrapper {
                display: flex;
                flex-direction: column;
                gap: var(--fw-length-xxs);
                font-size: var(--fw-font-size-s);
                color: var(--fw-color-content-liter);

                strong {
                    color: var(--fw-color-content-lite);
                }

                .feature {
                    transition: all 0.5s ease;
                    color: transparent;
                    height: 10px;
                    width: 120px;
                    border: 1px solid var(--fw-color-background-litest);
                }
            }
        }

        .description {
            position: absolute;
            top: 0;
            right: 0;
            padding: var(--fw-length-s) var(--fw-length-l);
            font-style: italic;
            color: var(--fw-color-content-litest);
        }
    }

    .next, .last {
        width: 40%;
        border-radius: var(--fw-length-l);
        background: #1c0b0b44;
        grid-template-columns: 48px 1fr;
        border-color: transparent;

        .content {
            opacity: 0.5;
            gap: var(--fw-length-xs);
        }

        .title {
            font-size: 14px;

            .name {
                font-size: 20px;
            }
        }

        .features {
            .feature-wrapper {
                font-size: var(--fw-font-size-xs);

                .feature {
                    height: 4px;
                }
            }
        }

        .cover {
            width: 64px;
            height: 64px;
            opacity: 0.5;

            img {
                border-radius: var(--fw-radius-m);
            }
        }
    }
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
}
</style>
