"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants.js";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BUTTON } from "./online-indicator-controller.constants";

export class OnlineIndicatorController {
  #live = false
  #numberOfPeers = 0;

  constructor() {
    this.init();
  }

  get #generatedIcon() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.icon]);
    let numberOfPeers = this.#numberOfPeers ? this.#numberOfPeers.toString() : TYPOGRAPHY.emptyString;
    numberOfPeers = numberOfPeers.length > 4 ? TYPOGRAPHY.ellipsis : numberOfPeers;
    container.innerHTML = `<span class="${DOM_ELEMENT_CLASS.peers}">${numberOfPeers}</span>`;
    return container;
  }

  get #generatedButton() {
    return ElementGenerator.generateButton(BUTTON, this.#onConnect.bind(this));
  }

  get #connectedState() {
    return this.#live ? this.#generatedIcon : this.#generatedButton;
  }

  get #initializedContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container).then(container => {
      ElementHandler.clearContent(container);
      return container;
    });
  }

  #initState() {
    this.#live = self.onlineConnection ? self.onlineConnection.live : false;
    this.#numberOfPeers = self.user ? self.user.peers.length : 0;
  }

  #onConnect() {
    self.onlineConnection.establishConnection(self.user.username);
  }

  init() {
    this.#initState();
    return this.#initializedContainer.then(container => {
      container.append(this.#connectedState);
    });
  }

  updateState() {
    this.#initState();
    return this.#initializedContainer.then(container => {
      container.append(this.#connectedState);
      return;
    });
  }

  onDestroy() {
    return this.#initializedContainer.then(() => {
      this.#live = false
      this.#numberOfPeers = 0;
      return;
    });
  }
}
