"use strict";
import { User } from "~/_models/user";
import { CONNECTION_CONFIG } from "./connection-config.constants";
import { NOTIFICATION_MESSAGE } from "~/components/toast-notification/toast-notification.constants";
import { valueDefined } from "~/_utils/validator";

export class OnlineConnection {
  #actions;
  #webSocket;
  #peers = [];

  constructor() {
    // this.actions = actions;


    // const peers = [];
    // peers.push(new User("kate1", "kate", "asdf"));
    // for (let index = 0; index < 10; index++) {
    //   const stringNumber = index.toString();
    //   const roomId = index % 2 === 0 ? "room" + stringNumber : undefined;
    //   let name = "kate" + stringNumber;
    //   for (let i = 0; i < index; i++) {
    //     name += "kate";
    //   }
    //   peers.push(new User(stringNumber, name, roomId));
    // }

    // this.peers = peers;
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

  get live() {
    return valueDefined(this.#webSocket);
  }



  establishConnection(userParams) {
    this.#webSocket = new WebSocket(
      CONNECTION_CONFIG.url,
      CONNECTION_CONFIG.protocols,
    );
    this.#webSocket.addEventListener("error", (event) => this.#onError(event));

    this.#webSocket.addEventListener("open", () => {
      this.#webSocket.addEventListener("message", (event) => this.#onMessage(JSON.parse(event.data)));
      this.#webSocket.addEventListener("close", (event) => this.#onClose(event));
      this.sendData("join", userParams);
    });
  }


  #onError(event) {
    this.#webSocket = undefined;
    console.log("#onError", event);
    self.toastNotifications.show(NOTIFICATION_MESSAGE.connectionError);
    this.#submitError();
  }

  #submitError(errorType = "connection-error") {
    if (this.onError) {
      this.onError(errorType);
    }
  }

  #onClose(event) {
    console.log("#onClose");
    console.log(event);
  }

  #onMessage(message) {
    switch (message.type) {
      case "username-in-use":
        self.toastNotifications.show(NOTIFICATION_MESSAGE.usernameInUse);
        this.#submitError(message.type);
        break;
      case "user-update":
        this.#handleUserUpdate(message.data);
        break;
      case "peers-update":
        this.#handlePeersUpdate(message.data);
        break;


      default:
        console.log("onConnectionMessage");
        console.log(message);
        break;
    }
  }

  #handlePeersUpdate(data) {
    console.log("handlePeersUpdate");
    this.peers = data.peers;
    // console.log(data);
  }


  #handleUserUpdate(data) {
    console.log("onUserUpdate");
    this.peers = data.peers;

    console.log(data);

    if (self.user) {
      console.log("user is here");
      console.log("--- onUserUpdate -----");
      console.log(data);
      return;
    }
    self.user = this.#generateUser(data.user);
    if (this.onUserUpdate) {
      this.onUserUpdate();
    }
  }

  sendData(type, data) {
    if (this.#webSocket) {
      const message = {
        type: type,
        data: data,
      };
      this.#webSocket.send(JSON.stringify(message));
    } else {
      console.log("no this.webSocket");
    }
  }

  disconnect(user) {
    console.log("disconnect");
    console.log(user);


  }


}
