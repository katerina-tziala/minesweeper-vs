'use strict';

import { URL, PROTOCOLS } from './connection.constants';
import { MessageInType } from './online-connection-messages/connection.message-in';


export default class Connection {
  #eventHandlers;

  #onMessage(event, webSocket, resolve, reject) {
    const message = JSON.parse(event.data);
    this.#removeSocketListeners(webSocket);

    const { type, errorType, data } = message;

    if (errorType) {
      webSocket.close();
      reject(errorType);
    } else if (type === MessageInType.Joined) {
      resolve({webSocket, data});
    }
  }

  #removeSocketListeners(webSocket) {
    for (const [eventType, listenerFunction] of this.#eventHandlers) {
      webSocket.removeEventListener(eventType, listenerFunction);
    }
    this.#eventHandlers = undefined;
  }

  #onOpen(webSocket, username) {
    const data = { type: 'join', data: { username } };
    webSocket.send(JSON.stringify(data));
  }

  #addSocketListeners(webSocket) {
    for (const [eventType, listenerFunction] of this.#eventHandlers) {
      webSocket.addEventListener(eventType, listenerFunction);
    }
  }

  #connect(username, resolve, reject) {
    const webSocket = new WebSocket(URL, PROTOCOLS);
    this.#eventHandlers.set('error', () => reject());
    this.#eventHandlers.set('open', () => this.#onOpen(webSocket, username));
    this.#eventHandlers.set('message', (event) => this.#onMessage(event, webSocket, resolve, reject));
    this.#addSocketListeners(webSocket);
  }

  init(username) {
    this.#eventHandlers = new Map();
    return new Promise((resolve, reject) => this.#connect(username, resolve, reject));
  }
}