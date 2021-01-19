"use strict";
import { timeoutPromise } from "~/_utils/utils";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, MOVE_OUT_DURATION } from "./game-message-box.constants";

export class GameMessageBox {

  static get newMessageBox() {
    const styles = [DOM_ELEMENT_CLASS.messsageBox, DOM_ELEMENT_CLASS.messsageBoxIn];
    const container = ElementGenerator.generateContainer(styles, DOM_ELEMENT_ID.messsageBox);
    return container;
  }

  static get messageBox() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.messsageBox);
  }

  static generateView(message) {
    const container = GameMessageBox.newMessageBox;
    container.append(GameMessageBox.generateMessageContent(message));
    return container;
  }

  static generateMessageContent(message) {
    const fragment = document.createDocumentFragment();
    Object.keys(message).forEach(key => {
      const style = DOM_ELEMENT_CLASS[key];
      const container = ElementGenerator.generateContainer([style]);
      container.innerHTML = message[key];
      fragment.append(container);
    });
    return fragment;
  }

  static removeMessageBox() {
    return GameMessageBox.messageBox.then(messageBox => {
      GameMessageBox.setSlideOutStyles(messageBox);
      return timeoutPromise(MOVE_OUT_DURATION);
    });
  }

  static setSlideOutStyles(messageBox) {
    ElementHandler.removeStyleClass(messageBox, DOM_ELEMENT_CLASS.messsageBoxIn);
    ElementHandler.addStyleClass(messageBox, DOM_ELEMENT_CLASS.messsageBoxOut);
  }

}
