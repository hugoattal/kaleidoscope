import { accessToken } from "@/lib/spotify/local.ts";

const baseApiUrl = "https://api.spotify.com/v1";

export async function spotifyApi(url: string, config?: RequestInit) {
    const targetUrl = url.startsWith("http") ? url : baseApiUrl + url;

    const response = await fetch(targetUrl, {
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
    let response = await spotifyApi(url, config);
    const items = response.items;

    while (response.next) {
        response = await spotifyApi(response.next);
        items.push(...response.items);
    }

    return items as T[];
}
