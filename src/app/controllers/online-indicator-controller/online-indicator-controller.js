"use strict";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BUTTON } from "./online-indicator-controller.constants";

export class OnlineIndicatorController {
  #live = false
  #numberOfPeers = 0;

  constructor() {
    this.#init();
  }

  #init() {
    this.#live = self.onlineConnection ? self.onlineConnection.live : false;
    this.#numberOfPeers = self.onlineConnection ? self.onlineConnection.peers.length : 0;
  }

  get #generatedIcon() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.icon]);
    if (this.#numberOfPeers) {
      container.innerHTML = `<span class="${DOM_ELEMENT_CLASS.peers}">${this.#numberOfPeers}</span>`;
    }
    return container;
  }

  get #generatedButton() {
    return ElementGenerator.generateButton(BUTTON, this.#onConnect.bind(this));
  }

  get #connectedState() {
    return this.#live ? this.#generatedIcon : this.#generatedButton;
  }

  get #container() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container);
  }

  generateView() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_ID.container);
    container.append(this.#connectedState);
    return container;
  }

  #onConnect() {
    self.onlineConnection.establishConnection(self.user.username);
  }

  updateState() {
    this.#init();
    return this.#container.then(container => {
      ElementHandler.clearContent(container);
      container.append(this.#connectedState);
      return;
    });
  }

}
