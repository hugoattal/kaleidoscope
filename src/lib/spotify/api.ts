import { accessToken } from "@/lib/spotify/local.ts";

const baseApiUrl = "https://api.spotify.com/v1";

export async function spotifyApi(url: string, config?: RequestInit) {
    const response = await fetch(baseApiUrl + url, {
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${ accessToken.value }`,
            "Content-Type": "application/json"
        },
        ...config
    });

    return response.json();
}

export async function spotifyApiList<T>(url: string, config?: RequestInit) {
    const response = await spotifyApi(url, config);
    const items = response.items;

    while (response.next) {
        const nextResponse = await spotifyApi(response.next);
        items.push(...nextResponse.items);
    }

    return items as T[];
}
