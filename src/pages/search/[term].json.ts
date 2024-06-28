import type { APIRoute } from "astro";

const client_id = import.meta.env.CLIENT_ID
const client_secret = import.meta.env.CLIENT_SECRET

let access_token = "";

const getToken = async () => {
    let resp = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`, {
        method: "POST"
    })
    access_token = (await resp.json()).access_token
}

const getSearch = async (term: string) => {
    return fetch("https://api.igdb.com/v4/games/", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Client-ID": client_id,
            "Authorization": `Bearer ${access_token}`,
        },
        body: `fields name,cover.image_id; search *"${term}"*; where cover.image_id != null;`
    })
}

export const GET: APIRoute = async ({ params, request }) => {
    let { term } = params
    let resp: Response, json: { message: string }

    if (typeof term === 'undefined') {
        return new Response(JSON.stringify([]))
        console.log(`Term is undefined`)
    }

    console.log(`Searching for ${term}`)

    // Get token if it's empty
    if (access_token.length === 0) {
        await getToken()
    }

    // Try the search
    resp = await getSearch(term)
    json = await resp.json()
    if (!!json.message) {
        console.log("Token failed, getting new token")
        // If failed get a new token and try again
        await getToken()
        resp = await getSearch(term)
        json = await resp.json()
    }

    return new Response(JSON.stringify(json))
}

export const prerender = false