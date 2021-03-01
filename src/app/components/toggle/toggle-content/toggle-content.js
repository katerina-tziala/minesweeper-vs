"use strict";
import {
  ElementHandler,
  ElementGenerator
} from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS
} from "./toggle-content.constants";

export class ToggleContent {
  #id;
  constructor(name) {
    this.id = name;
  }

  set id(id) {
    this.#id = DOM_ELEMENT_ID.content + id;
  }

  get id() {
    return this.#id;
  }

  get documentElement() {
    return ElementHandler.getByID(this.id);
  }

  get elementHeight() {
    return this.documentElement.then(container => {
      return ElementHandler.getElementHeight(container);
    }).catch(() => {
      return Promise.resolve(0);
    });
  }

  generateView(content) {
    const contentContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.content], this.id);
    if (content) {
      contentContainer.append(content);
    }
    return contentContainer;
  }

  updateView(content) {
    console.log("updateView content");
    console.log(content);
  }

}
