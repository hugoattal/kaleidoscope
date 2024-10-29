import { useLocalStorage } from "@vueuse/core";

export const particleSpeed = useLocalStorage("kds-particle-speed", "1");
export const backgroundColor = useLocalStorage("kds-background-color", "#130505");
