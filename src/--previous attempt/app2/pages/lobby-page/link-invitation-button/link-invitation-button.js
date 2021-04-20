"use strict";
import { ElementGenerator, ElementHandler } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS, BUTTON, CONTENT } from "./link-invitation-button.constants";

export class LinkInvitationButton {

  static generate(action) {
    const button = ElementGenerator.generateButton(BUTTON, action);
 
    const icon = document.createElement("span");
    ElementHandler.addStyleClass(icon, DOM_ELEMENT_CLASS.icon);

    const text = document.createElement("span");
    ElementHandler.addStyleClass(text, DOM_ELEMENT_CLASS.text);
    text.innerHTML = CONTENT.text;

    button.append(icon, text);
    return button;
  }

}
