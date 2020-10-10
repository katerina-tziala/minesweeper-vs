'use strict';

import { CONNECTION_CONFIG } from './connection-config.constants';

export class OnlineConnection {
    #actions;
    #webSocket;

    constructor(userParams, actions) {
        this.actions = actions;
        this.init(userParams);
    }

    set actions(actions) {
        this.#actions = actions;
    }

    get actions() {
        return this.#actions;
    }

    set webSocket(webSocket) {
        this.#webSocket = webSocket;
    }

    get webSocket() {
        return this.#webSocket;
    }

    init(userParams) {
        console.log(userParams);

        this.webSocket = new WebSocket(CONNECTION_CONFIG.url, CONNECTION_CONFIG.protocols);
        this.webSocket.addEventListener('error', event => this.actions.onError(event));


        this.webSocket.addEventListener('open', event => {
            console.log('open--------');
            console.log(event);

            // this.webSocket.addEventListener('message', event => {
            //     const data = JSON.parse(event.data);
            //     console.log(data);
            //     console.log('message--------');
            //     console.log(data);
            //     // if (data.type) {
            //     //    this.connectionMessageHandler(data);
            //     // }
            // });
            // this.webSocket.addEventListener('close', event => {
            //     console.log('close--------');
            //     console.log(event);

            // });
        });



    }
}
