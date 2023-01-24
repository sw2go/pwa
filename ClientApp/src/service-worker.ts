import { skipWaiting, clientsClaim } from "workbox-core" 
import { registerRoute, NavigationRoute } from "workbox-routing";
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { SWM } from './service-worker-messages';




// @ts-ignore: __WB_MANIFEST is a placeholder filled by workbox-webpack-plugin with the list of dependecies to be cached
const assetsToCache = self.__WB_MANIFEST;

const SW_VERSION = '1.0.0';

self.addEventListener('message', (event) => {
    if (event.data.type === SWM.GET_VERSION) {
        event.ports[0].postMessage(SW_VERSION);
    }
});








// Precaching (local files available at build time)
cleanupOutdatedCaches();
precacheAndRoute(assetsToCache);



// Runtime caching

const matchCb = ({url, request, event}) => {
    return url.pathname === './api/data/3';
};

const handlerCb = async ({url, request, event, params}) => {
    console.log({url, request, event, params});
    console.log("3");
    const response = await fetch(request);
    const responseBody = await response.text();
    return new Response(`${responseBody} <!-- Look there is Added Content. -->`, {
        headers: response.headers,
    });
};

registerRoute(matchCb, handlerCb);










