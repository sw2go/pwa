import { skipWaiting, clientsClaim } from "workbox-core" 
import { registerRoute, NavigationRoute  } from "workbox-routing";
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { SWM } from './service-worker-messages';




// @ts-ignore: __WB_MANIFEST is a placeholder filled by workbox-webpack-plugin with the list of dependecies to be cached
const assetsToCache = self.__WB_MANIFEST;

const SW_VERSION = '1.0.10';

self.addEventListener('message', (event) => {
    if (event.data) {
        if (event.data.type === "SKIP_WAITING") {
            console.log(`skipWaiting ${SW_VERSION}`);  
            skipWaiting();
            event.ports[0].postMessage(SW_VERSION);
        } else if (event.data.type === SWM.GET_VERSION) {
            event.ports[0].postMessage(SW_VERSION);
        }
    }
});

self.addEventListener('install', event => {
    console.log(`install ${SW_VERSION}` , event);    

    (self as any).clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage("bla");          
            console.log('tata ' + + SW_VERSION);  
        });        
    })
});

self.addEventListener('activate', event => {
    console.log(`activate ${SW_VERSION}`, event);
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

//registerRoute(matchCb, handlerCb);


const testRoute = ({url, request, event}) => {
    const match = /\/api\/data.+$/i.test(url.pathname);
    console.log(`match ${match}  ${url.pathname}`);
    return  match;
};

const testHandler = async ({url, request, event, params}) => {

    const response = await fetch("./test.html", {
        method: 'GET',
        headers: {
            'Accept': 'text/html',
        },
    });

    const responseBody = await response.text();
    return new Response(`${responseBody}`, {
        headers: response.headers,
    });
};

registerRoute(testRoute, testHandler);






