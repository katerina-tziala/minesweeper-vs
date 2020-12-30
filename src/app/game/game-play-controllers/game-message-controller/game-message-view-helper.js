"use strict";

import { clone, replaceStringParameter } from "~/_utils/utils";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, ANIMATIONS } from "./game-message-controller.constants";

export class GameMessageViewHelper {

  static generateContainer() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_ID.container);
    ElementHandler.hide(container);
    return container;
  }

  static generateMessageBox(message) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.messsageBox, DOM_ELEMENT_CLASS.messsageBoxIn]);
    const title = GameMessageViewHelper.generateTitle(message.title);
    const subtitle = GameMessageViewHelper.generateSubtitle(message.subtitle);
    const content = GameMessageViewHelper.generateContent(message.content);
    container.append(title, subtitle, content);
    return container;
  }

  static generateTitle(title) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.title]);
    container.innerHTML = title;
    return container;
  }

  static generateSubtitle(subtitle) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.subtitle]);
    container.innerHTML = subtitle;
    return container;
  }

  static generateContent(content) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.content]);
    container.innerHTML = content;
    return container;
  }
  
  static displayedContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container).then(container => {
      ElementHandler.clearContent(container);
      ElementHandler.display(container);
      return container;
    });
  }

  static hideContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container).then(container => {
      ElementHandler.hide(container);
      ElementHandler.clearContent(container);
      return;
    });
  }

  static setMessageBoxSlideOutStyles(messageBox) {
    ElementHandler.removeStyleClass(messageBox, DOM_ELEMENT_CLASS.messsageBoxIn);
    ElementHandler.addStyleClass(messageBox, DOM_ELEMENT_CLASS.messsageBoxOut);
  }

  static onMessageBoxRemoved(messageBox) {
    GameMessageViewHelper.setMessageBoxSlideOutStyles(messageBox);
    return new Promise(resolve => {
      setTimeout(() =>resolve(), ANIMATIONS.moveOutDuration);
    });
  }
  

}
