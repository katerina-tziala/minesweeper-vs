"use strict";

import { CONNECTION_CONFIG } from "./connection-config.constants";

export class OnlineConnection {
	#actions;
	#webSocket;

	constructor(actions) {
		this.actions = actions;
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

	establishConnection(userParams) {
		this.webSocket = new WebSocket(CONNECTION_CONFIG.url, CONNECTION_CONFIG.protocols);
		this.webSocket.addEventListener("error", event => this.actions.onError(event));
		this.webSocket.addEventListener("open", () => {
			this.webSocket.addEventListener("message", event => this.actions.onMessage(JSON.parse(event.data)));
			this.webSocket.addEventListener("close", event => this.actions.onClose(event));
			this.joinOnlineGaming(userParams);
		});
	}

	sendData(type, data) {
		if (this.webSocket) {
			const message = {
				type: type,
				data: data
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
