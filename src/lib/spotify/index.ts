import { base64encode, generateRandomString, sha256 } from "./lib.ts";
import { accessToken, authorizationState, codeVerifier, disconnect, refreshToken } from "@/lib/spotify/local.ts";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const redirectUri = getRedirectUri();

type TTokenResponse = {
    access_token: string;
    refresh_token?: string;
};

type TTokenErrorResponse = {
    error: string;
    error_description?: string;
};

function getRedirectUri() {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    return url.toString();
}

export async function requestAuthorization() {
    codeVerifier.value = generateRandomString(64);
    authorizationState.value = generateRandomString(32);
    const hashed = await sha256(codeVerifier.value);
    const codeChallenge = base64encode(hashed);

    const scope = [
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "playlist-modify-private",
        "playlist-modify-public",
        "user-read-currently-playing",
        "user-read-playback-state"
    ].join(" ");
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    const params = {
        client_id: clientId,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        redirect_uri: redirectUri,
        response_type: "code",
        scope,
        state: authorizationState.value
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

export async function getToken(code: string, state: string | null) {
    const expectedState = authorizationState.value;
    authorizationState.value = "";

    if (!state || state !== expectedState) {
        codeVerifier.value = "";
        throw new Error("Invalid Spotify authorization state");
    }

    const response = await requestToken(new URLSearchParams({
        client_id: clientId,
        code,
        code_verifier: codeVerifier.value,
        grant_type: "authorization_code",
        redirect_uri: redirectUri
    }));

    codeVerifier.value = "";
    accessToken.value = response.access_token;

    if (response.refresh_token) {
        refreshToken.value = response.refresh_token;
    }
}

export async function getRefreshToken() {
    try {
        const response = await requestToken(new URLSearchParams({
            client_id: clientId,
            grant_type: "refresh_token",
            refresh_token: refreshToken.value
        }));

        accessToken.value = response.access_token;

        if (response.refresh_token) {
            refreshToken.value = response.refresh_token;
        }
    }
    catch (error) {
        disconnect();
        throw error;
    }
}

async function requestToken(body: URLSearchParams) {
    const result = await fetch("https://accounts.spotify.com/api/token", {
        body,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    });
    const response = await result.json() as TTokenResponse | TTokenErrorResponse;

    if (!result.ok) {
        const error = response as TTokenErrorResponse;
        throw new Error(error.error_description || error.error);
    }

    return response as TTokenResponse;
}
