import { base64encode, generateRandomString, sha256 } from "./lib.ts";
import { accessToken, authorizationCode, codeVerifier, refreshToken, userId } from "@/lib/spotify/local.ts";
import { spotifyApi } from "@/lib/spotify/api.ts";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const redirectUri = getRedirectUri();

function getRedirectUri() {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    return url.toString();
}

export async function requestAuthorization() {
    codeVerifier.value = generateRandomString(64);
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
        scope
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

export async function getToken() {
    const tokenUrl = new URL("https://accounts.spotify.com/api/token");

    const payload = {
        body: new URLSearchParams({
            client_id: clientId,
            code: authorizationCode.value,
            code_verifier: codeVerifier.value,
            grant_type: "authorization_code",
            redirect_uri: redirectUri
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    };

    const body = await fetch(tokenUrl, payload);
    const response = await body.json();

    accessToken.value = response.access_token;
    refreshToken.value = response.refresh_token;

    userId.value = (await spotifyApi("/me")).id;
}

export async function getRefreshToken() {
    const tokenUrl = new URL("https://accounts.spotify.com/api/token");

    const payload = {
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: "refresh_token",
            refresh_token: refreshToken.value
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    };

    const body = await fetch(tokenUrl, payload);
    const response = await body.json();

    accessToken.value = response.access_token;
    refreshToken.value = response.refresh_token;
}
