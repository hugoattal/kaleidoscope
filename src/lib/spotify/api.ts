import { getRefreshToken } from "@/lib/spotify/index.ts";
import { accessToken } from "@/lib/spotify/local.ts";
import router from "@/router";

const baseApiUrl = "https://api.spotify.com/v1";

type TSpotifyErrorResponse = {
    error: {
        message: string;
        status: number;
    };
};

type TSpotifyPage<T> = {
    items: Array<T>;
    next: string | null;
};

export async function spotifyApi<T>(url: string, config?: RequestInit, refresh = true): Promise<T | undefined> {
    const targetUrl = url.startsWith("http") ? url : baseApiUrl + url;
    const headers = new Headers(config?.headers);
    headers.set("Accept", "application/json");
    headers.set("Authorization", `Bearer ${ accessToken.value }`);
    headers.set("Content-Type", "application/json");

    const response = await fetch(targetUrl, {
        ...config,
        headers
    });

    if (response.status === 204) {
        return;
    }

    const responseJson = await response.json() as T | TSpotifyErrorResponse;

    if (response.ok) {
        return responseJson as T;
    }

    if (response.status === 401 && refresh) {
        try {
            await getRefreshToken();
        }
        catch (error) {
            await router.push({ name: "landing" });
            throw error;
        }

        return spotifyApi<T>(url, config, false);
    }

    const error = responseJson as TSpotifyErrorResponse;

    if (response.status === 401) {
        accessToken.value = "";
        await router.push({ name: "landing" });
    }

    alert(`Error: ${ error.error.message }`);
    throw new Error(error.error.message);
}

export async function spotifyApiList<T>(url: string, config?: RequestInit) {
    let response = await spotifyApi<TSpotifyPage<T>>(url, config);

    if (!response) {
        throw new Error("Spotify returned no content for a paginated request");
    }

    const items = response.items;

    while (response.next) {
        const nextResponse = await spotifyApi<TSpotifyPage<T>>(response.next);

        if (!nextResponse) {
            throw new Error("Spotify returned no content for a paginated request");
        }

        response = nextResponse;
        items.push(...nextResponse.items);
    }

    return items;
}
