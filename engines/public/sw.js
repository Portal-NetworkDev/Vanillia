importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("fetch", event => {
    event.respondWith((async () => {
        try {
            await scramjet.loadConfig();
        } catch (error) {
            console.error("scramjet config unavailable:", error);
            return fetch(event.request);
        }
        if (scramjet.route(event)) return scramjet.fetch(event);
        return fetch(event.request);
    })());
});
