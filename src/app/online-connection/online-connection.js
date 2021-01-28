"use strict";
import { User } from "~/_models/user";
import { CONNECTION_CONFIG } from "./connection-config.constants";


export class OnlineConnection {
  #actions;
  #webSocket;
  #peers = [];

  constructor(actions) {
    this.actions = actions;


    const peers = [];
    peers.push(new User("kate1", "kate", "asdf"));
    for (let index = 0; index < 10; index++) {
      const stringNumber = index.toString();
      const roomId = index % 2 === 0 ? "room" + stringNumber : undefined;
      let name = "kate" + stringNumber;
      for (let i = 0; i < index; i++) {
        name += "kate";
      }
      peers.push(new User(stringNumber, name, roomId));
    }

    this.peers = peers;
  }

  set actions(actions) {
    this.#actions = actions;
  }

  get actions() {
    return this.#actions;
  }

  set peers(peers) {
    return this.#peers = peers.map((peerData) => this.#generateUser(peerData));
  }

  #generateUser(userData) {
    return new User(userData.id, userData.username, userData.gameRoomId);
  }

  get peers() {
    return this.#peers;
  }

  set webSocket(webSocket) {
    this.#webSocket = webSocket;
  }

  get webSocket() {
    return this.#webSocket;
  }

  establishConnection(userParams) {
    this.webSocket = new WebSocket(
      CONNECTION_CONFIG.url,
      CONNECTION_CONFIG.protocols,
    );
    this.webSocket.addEventListener("error", (event) =>
      this.actions.onError(event),
    );
    this.webSocket.addEventListener("open", () => {
      this.webSocket.addEventListener("message", (event) =>
        this.actions.onMessage(JSON.parse(event.data)),
      );
      this.webSocket.addEventListener("close", (event) =>
        this.actions.onClose(event),
      );
      this.joinOnlineGaming(userParams);
    });
  }

  sendData(type, data) {
    if (this.webSocket) {
      const message = {
        type: type,
        data: data,
      };
      this.webSocket.send(JSON.stringify(message));
    } else {
      console.log("no this.webSocket");
    }
  }

  joinOnlineGaming(userParams) {
    this.sendData("join", userParams);
  }
}
