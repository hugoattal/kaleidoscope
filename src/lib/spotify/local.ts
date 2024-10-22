import { useLocalStorage } from "@vueuse/core";

export const codeVerifier = useLocalStorage("k_code_verifier", "");
export const authorizationCode = useLocalStorage("k_authorization_code", "");
export const accessToken = useLocalStorage("k_access_token", "");
export const userId = useLocalStorage("k_user_id", "");

export function disconnect() {
    codeVerifier.value = "";
    authorizationCode.value = "";
    accessToken.value = "";
    userId.value = "";
}
