import { reactive } from "vue";

export enum EState {
    ANALYZER = "analyzer",
    MIXER = "mixer"
}

export const stateStore = reactive({
    current: EState.ANALYZER
});
