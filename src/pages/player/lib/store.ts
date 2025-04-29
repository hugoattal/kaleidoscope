import { useLocalStorage } from "@vueuse/core";
import {reactive} from "vue";

export const particleSpeed = useLocalStorage("kds-particle-speed", "1");
export const backgroundColor = useLocalStorage("kds-background-color", "#130505");

export const playerStore = reactive({
    offline: false
});