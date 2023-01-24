import "./css/main.css";
import {Workbox} from 'workbox-window';
import { SWM } from './service-worker-messages';

const divMessages: HTMLDivElement = document.querySelector("#divMessages");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");
const divInfo: HTMLDivElement = document.querySelector("#divInfo");
const imgStatus: HTMLImageElement = document.querySelector("#imgStatus");

btnSend.addEventListener("click", send);

async function send() {
    try {
        imgStatus.src = "./assets/cloud-update.svg";
        let response = await fetch(`api/data/${tbMessage.value}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.headers.has("offline")) {
            console.log("offline");
            imgStatus.src = "./assets/cloud-offline.svg";
        } else {
            imgStatus.src = "./assets/cloud-online.svg";
            divMessages.innerHTML += await response.text();
        }
    } catch (err) {
        console.log("send", err);
    }
}

if ('serviceWorker' in navigator) {

    const wb = new Workbox('./service-worker.js');

    const update: HTMLButtonElement = document.querySelector("#btnUpdate");

    wb.addEventListener("waiting", event => {
        console.log('waiting');
        update.classList.remove("hide");
        update.addEventListener("click", () => {
            wb.addEventListener("controlling", event => {
                console.log('controlling');
                window.location.reload();
            });
            wb.messageSW({ type: "SKIP_WAITING" });
        });        
    });

    wb.register();
    wb.messageSW({type: SWM.GET_VERSION}).then(version => {
        divInfo.innerText += "ServiceWorker: " + version;
        console.log('Service Worker version:', version);
    });

    setInterval(() => { 
        console.log("check");
        wb.update().then(() => {
            console.log("check resolve");
    }).catch(() => console.log("check falil"))}, 10000);

}

