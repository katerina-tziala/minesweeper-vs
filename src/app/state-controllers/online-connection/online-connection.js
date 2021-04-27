'use strict';

import { URL, PROTOCOLS } from './connection.constants';

export default
  class OnlineConnection {
  #webSocket;

  constructor() {
    this.#webSocket = undefined;
    this.onConnectionError = undefined;
    this.onMessage = undefined;
    this.onErrorMessage = undefined;
  }


  get live() {
    return this.#webSocket && this.#webSocket.readyState === 1;
  }

  static getInstance() {
    if (!OnlineConnection.instance) {
      OnlineConnection.instance = new OnlineConnection;
    }
    return OnlineConnection.instance;
  }

  establishConnection(data) {
    this.#webSocket = new WebSocket(URL, PROTOCOLS);
    this.#webSocket.addEventListener('error', this.#onError.bind(this));
    this.#webSocket.addEventListener('open', () => this.#onOpened(data));
  }

  #onOpened(data) {
    this.sendMessage('join', data);
    this.#webSocket.addEventListener('message', (event) => this.#onMessageReceived(JSON.parse(event.data)));
    this.#webSocket.addEventListener('close', this.#onClosed.bind(this));
    // this.#webSocket.close();
  }

  #onError(event) {
   // console.log('error', event);
    // console.log(this.#webSocket);
    if (this.#webSocket && this.#webSocket.readyState === 3) {
      console.log('The connection is closed or couldn"t be opened');
      if (this.onConnectionError) {
        this.onConnectionError();
      }
    }
  }

  #onClosed(event) {
    //console.log('closed', event);
    console.log('wasClean', event.wasClean);
    console.log('wasClean property is set to false when the WebSocket connection did not close via the close handshake');
    // console.log(this.#webSocket);
  }





  #submitErrorMessage(message) {
    if (this.onErrorMessage) {
      this.onErrorMessage(message);
    }
  }

  #submitMessage(message) {
    if (this.onMessage) {
      this.onMessage(message);
    }
  }


  #onMessageReceived(message) {
    const { type } = message;
    if (!type) {
      return;
    }
    if (type === 'error') {
      // console.log('on Connection Error Message');
      // console.log(message);
      // console.log('------------------');
      this.#submitErrorMessage(message);
    } else {
      // console.log('onConnectionMessage');
      // console.log(message);
      // console.log('------------------');
      this.#submitMessage(message);
    }
  }

  sendMessage(type, data) {
    if (this.live) {
      const message = { type, data };
      this.#webSocket.send(JSON.stringify(message));
    } else {
      console.log('no connection');
    }
  }

}