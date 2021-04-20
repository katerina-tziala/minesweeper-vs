"use strict";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, BUTTON } from "./loggout-button.constants";

export class LoggoutButton {

  static generate(onLogout) {
    return  LoggoutButton.#initializedContainer.then(container => {
      const button = ElementGenerator.generateButton(BUTTON, onLogout);
      container.append(button);
      return;
    });
  }

  static get #initializedContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container).then(container => {
      ElementHandler.clearContent(container);
      return container;
    });
  }

  static remove() {
    return LoggoutButton.#initializedContainer;
  }
}
