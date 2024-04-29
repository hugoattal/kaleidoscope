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

    const responseJson = await response.json();

    if (responseJson.error) {
        if (responseJson.error.message === "The access token expired") {
            accessToken.value = "";
        }

        alert(`Error: ${ responseJson.error.message }`);
        throw new Error(responseJson.error.message);
    }

    return responseJson;
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
