import { useLocalStorage } from "@vueuse/core";

export const codeVerifier = useLocalStorage("k_code_verifier", "");
export const authorizationState = useLocalStorage("k_authorization_state", "");
export const accessToken = useLocalStorage("k_access_token", "");
export const refreshToken = useLocalStorage("k_refresh_token", "");

export function disconnect() {
    codeVerifier.value = "";
    authorizationState.value = "";
    accessToken.value = "";
    refreshToken.value = "";
}
