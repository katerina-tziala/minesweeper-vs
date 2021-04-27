'use strict';

import { URL, PROTOCOLS } from './connection.constants';

class OnlineConnection {
  #webSocket;


  constructor() {
    if (!OnlineConnection.instance) {
      this._data = [];
      console.log("new");
      this.webSocket = undefined;
      OnlineConnection.instance = this;
    }
  }

  add(item) {
    this._data.push(item);
  }

  get() {
    return this._data;
  }

  #connect() {
    this.webSocket = new WebSocket(URL, PROTOCOLS);

    this.webSocket.addEventListener('error', (event) => {
      console.log('error', event);
    });


    this.webSocket.addEventListener('open', () => {
      this.webSocket.addEventListener('message', (event) => {
        console.log('error', event);
        console.log(JSON.parse(event.data));
      });


      this.webSocket.addEventListener('close', (event) => {
        console.log('close', event);
      });

      //this.sendData('join', { username });
    });
  }

  establishConnection(data) {
    this.#connect();
    console.log(establishConnection);
    console.log(data);

  }







}

const onlineConnection = new OnlineConnection();
Object.freeze(onlineConnection);

export default onlineConnection;
