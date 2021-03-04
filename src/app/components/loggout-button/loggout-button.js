"use strict";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, BUTTON } from "./loggout-button.constants";

export class LoggoutButton {

  static generate(onLogout) {
    return  LoggoutButton.container.then(container => {
      const button = ElementGenerator.generateButton(BUTTON, onLogout);
      container.append(button);
      return;
    });
  }

  static get container() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container);
  }

  static remove() {
    return LoggoutButton.container.then(container => {
      ElementHandler.clearContent(container);
      return;
    });
  }
}
