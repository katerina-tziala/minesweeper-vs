'use strict';

import { URL, PROTOCOLS } from './connection.constants';
import Connection from './connection';
import AppUserService from '../app-user.service';

export class OnlineConnection {
  #appUserService;
  #webSocket;

  #peers = [];
  constructor() {
    this.#appUserService = AppUserService.getInstance();
    this.#webSocket = undefined;
    this.onConnectionError = undefined;
    this.onMessage = undefined;
    this.onErrorMessage = undefined;
  }

  get live() {
    return true;
    //return (this.#webSocket && this.#webSocket.readyState === 1) ? true : false;
  }

  static getInstance() {
    if (!OnlineConnection.instance) {
      OnlineConnection.instance = new OnlineConnection;
    }
    return OnlineConnection.instance;
  }

  establishConnection(username) {
    //disconnect => this.#webSocket.close();
    this.#webSocket = undefined;
    const connection = new Connection();
    return connection.init(username)
      .then(({ webSocket, data }) => {
        this.#webSocket = webSocket;
        this.#peers = data.peers;
        this.#appUserService.onConnected(data.user);
        this.#setWebsocketListeners();
        return;
      });
  }

  #setWebsocketListeners() {
    this.#webSocket.addEventListener('error', this.#onError.bind(this));
    this.#webSocket.addEventListener('message', (event) => this.#onMessageReceived(JSON.parse(event.data)));
    this.#webSocket.addEventListener('close', this.#onClosed.bind(this));
  }

  #onError() {
    // console.log('error', event);
    // console.log(this.#webSocket);
    if (this.#webSocket && this.#webSocket.readyState === 3) {
      console.log('The connection is closed or could not be opened');
    }

    this.#webSocket = undefined;
    if (this.onConnectionError) {
      this.onConnectionError();
    }
  }

  #onClosed(event) {
    console.log('closed', event);
    console.log('wasClean', event.wasClean);
    console.log('wasClean property is set to false when the WebSocket connection did not close via the close handshake');
    // console.log(this.#webSocket);
  }

  #onMessageReceived(message) {
    const { type } = message;
    console.log('online connection --- onMessageReceived');
    console.log(message);
    if (type) {
      type === 'error' ? this.#submitErrorMessage(message) : this.#submitMessage(message);
    }
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

  sendMessage(type, data) {
    if (this.live) {
      const message = { type, data };
      this.#webSocket.send(JSON.stringify(message));
    } else {
      console.log('no connection');
    }
  }

}