import "./css/main.css";
import {Workbox} from 'workbox-window';
import { SWM } from './service-worker-messages';

const divMessages: HTMLDivElement = document.querySelector("#divMessages");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");
const divInfo: HTMLDivElement = document.querySelector("#divInfo");

btnSend.addEventListener("click", send);

function send() {

    let text = tbMessage.value;

    let url = `api/data/${text}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
    .then(r => r.text())
    .then(txt => divMessages.innerHTML += txt );
}

if ('serviceWorker' in navigator) {

    const wb = new Workbox('./service-worker.js');

    const update: HTMLButtonElement = document.querySelector("#btnUpdate");

    wb.addEventListener("waiting", event => {
        console.log('waiting');
        update.disabled = false;
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






}

