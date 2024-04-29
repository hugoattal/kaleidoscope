import { useStorage } from "@vueuse/core";

export const localStore = useStorage("ks-local", {
    deployedPlaylists: false
});
