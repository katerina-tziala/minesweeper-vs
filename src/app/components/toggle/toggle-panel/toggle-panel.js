"use strict";

import {
  ElementHandler,
  ElementGenerator
} from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS
} from "./toggle-panel.constants";

export class TogglePanel {
  #id;
  #overflow = false;

  constructor(name, overflow = false) {
    this.id = name;
    this.#overflow = overflow;
  }

  set id(id) {
    this.#id = DOM_ELEMENT_ID.panel + id;
  }

  get id() {
    return this.#id;
  }

  get documentElement() {
    return ElementHandler.getByID(this.id);
  }

  #setPanelHeight(panel, height = 0) {
    ElementHandler.setElementHeight(panel, height);
  }

  #setPanelOverflow(panel) {
    ElementHandler.setElementOverflow(panel, this.#overflow);
  }

  #onTransitionEnd() {
    if (this.onAnimationEnd) {
      this.onAnimationEnd();
    }
  }

  generateView() {
    const panel = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.panel], this.id);
    this.#setPanelHeight(panel);
    this.#setPanelOverflow(panel);
    panel.addEventListener("transitionend", this.#onTransitionEnd.bind(this));
    return panel;
  }

  updateHeight(height = 0) {
    return this.documentElement.then(container => {
      if (height === 0) {
        this.#overflow = false;
        this.#setPanelOverflow(container);
      }
      this.#setPanelHeight(container, height);
      return;
    });
  }

  updateOverlflow(overflow = false) {
    this.#overflow = overflow;
    return this.documentElement.then(container => {
      this.#setPanelOverflow(container);
      return;
    });
  }

  clickedInside(event) {
    const target = event.target.closest(`#${this.#id}`);
    return !!target;
  }

}
