"use strict";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BUTTON } from "./online-indicator-controller.constants";

export class OnlineIndicatorController {
  #live = false

  constructor() {
    this.#init();
  }

  #init() {
    this.#live = self.onlineConnection ? self.onlineConnection.live : false;
  }

  get #generatedIcon() {
    return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.icon]);
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
    self.onlineConnection.establishUserConnection();
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
