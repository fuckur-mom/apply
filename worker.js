addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
})

/** 
 * @param {Request} request 
 */
async function handleRequest(request) {
    const url = new URL(request.url);
    let data = new Response(JSON.stringify({ code: 200, message: "success." }), { status: 200, headers: { "Content-Type": "application/json" } });;
    switch (url.pathname.toLowerCase()) {
        case "/backgroundimage":
            data = await handleBackgroundImage(request);
            break;
        case "/info":
            data = await handleInfo(request);
            break;
    }

    const headers = {};
    data.headers.forEach((value, key) => {
        if (!key.startsWith("x-")) {
            headers[key] = value;
        }
    })

    return new Response(await data.text(), {
        headers: {
            ...headers,
            "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
            "Access-Control-Allow-Method": "*",
            "Access-Control-Max-Age": "3600",
            "Access-Control-Allow-Header": "*"
        },
        status: data.status,
        statusText: data.statusText
    })
}

async function handleBackgroundImage(request) {
    const res = await fetch("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1", {
        method: "GET"
    });
    if (res.status !== 200) {
        return new Response("Error.", { status: 500 })
    }
    const data = await res.json();
    const imageUrl = "https://www.bing.com" + data.images[0].url;
    console.log("Image:", imageUrl);
    const image = await fetch(imageUrl, {
        method: "GET"
    });
    if (image.status !== 200) {
        return new Response("Error.", { status: 500 })
    }
    return image;
}

async function handleInfo(request) {
    const res = await fetch("https://raw.githubusercontent.com/fuckur-mom/apply/main/info.json", {
        method: "GET"
    });
    if (res.status !== 200) {
        return new Response("Error.", { status: 500 })
    }
    return new Response(await res.text(), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
