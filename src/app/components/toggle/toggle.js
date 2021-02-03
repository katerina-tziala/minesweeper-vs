"use strict";
import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import {  
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  BUTTON
} from "./toggle.constants";
import { clone, roundUpToNextDecade, replaceStringParameter } from "~/_utils/utils";

export class Toggle {
  #expanded = false;
  constructor(name, expanded = false) {
    this.name = name;
    console.log("toggle");
    this.#expanded = expanded;
  }

  get #containerId() {
    return DOM_ELEMENT_ID.container + this.name;
  }

  get #buttonId() {
    return DOM_ELEMENT_ID.toggleButton + this.name;
  }

  get #toggleButton() {
    return ElementHandler.getByID(this.#buttonId);
  }

  get #toggleButtonParams() {
    const params = clone(BUTTON);
    params.className = params.className + this.name;
    params.attributes["aria-label"] = replaceStringParameter(params.attributes["aria-label"], this.name);
    return params;
  }



  
  generateView() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], this.#containerId);
    const button = ElementGenerator.generateButton(this.#toggleButtonParams, this.#onToggleButtonChange.bind(this));
    ElementHandler.setID(button, this.#buttonId);

    // conntent container
    container.append(button);
    return container;
  }


  #onToggleButtonChange() {
    this.#expanded = !this.#expanded;
    // const expanded = JSON.parse(event.target.getAttribute("aria-expanded"));
    // console.log(expanded);
    console.log("onToggleButtonChange");
    console.log(this.name);
    console.log(this.#buttonId);
    console.log(this.#expanded);

    this.#setToggleButtonState();
  }



  #setToggleButtonState() {
    this.#toggleButton.then((btn) => {
      ElementHandler.removeStyleClass(btn, DOM_ELEMENT_CLASS.toggleButtonExpanded);
      AriaHandler.setAriaExpanded(btn, this.#expanded);
      if (this.#expanded) {
        ElementHandler.addStyleClass(btn, DOM_ELEMENT_CLASS.toggleButtonExpanded);
      }
    });
  }


}
