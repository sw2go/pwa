import "./css/main.css";
import {Workbox} from 'workbox-window';
import { SWM } from './service-worker-messages';

const divMessages: HTMLDivElement = document.querySelector("#divMessages");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");

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
    wb.register();
    
    wb.messageSW({type: SWM.GET_VERSION}).then(version => {
        console.log('Service Worker version:', version);
    });




}

