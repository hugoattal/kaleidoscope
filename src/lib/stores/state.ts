import { reactive } from "vue";

export enum EState {
    ANALYZER = "analyzer",
    MIXER = "mixer",
    MERGER = "merger",
}

export const stateStore = reactive({
    current: EState.ANALYZER
});
