"use strict";
import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  BUTTON,
  ARIA_CONTENT
} from "./toggle-button.constants";

export class ToggleButton {
  #id;
  #name;

  constructor(name, expanded = false, disabled = false) {
    this.#name = name;
    this.id = name;
    this.expanded = expanded;
    this.disabled = disabled;
  }

  set id(id) {
    this.#id = DOM_ELEMENT_ID.button + id;
  }

  get id() {
    return this.#id;
  }

  get documentElement() {
    return ElementHandler.getByID(this.id);
  }

  get #ariaLabelContent() {
    return this.expanded ? ARIA_CONTENT.hide : ARIA_CONTENT.display;
  }

  get #styles() {
    const styles = [DOM_ELEMENT_CLASS.button];
    styles.push(DOM_ELEMENT_CLASS.buttonnModifier + this.#name);
    if (this.expanded) {
      styles.push(DOM_ELEMENT_CLASS.buttonExpanded);
    }
    return styles;
  }

  #setAriaAttributes(button) {
    AriaHandler.setAriaExpanded(button, this.expanded);
    AriaHandler.setAriaLabel(button, this.#ariaLabelContent);
  }

  #setStyles(button) {
    ElementHandler.setStyleClass(button, this.#styles);
  }

  #setDisplay(button) {
    this.#setStyles(button);
    this.#setAriaAttributes(button);
  }

  #updateDisplay() {
    this.documentElement.then(button => this.#setDisplay(button)).catch(() => { });
  }

  #onToggle() {
    if (this.disabled) {
      return;
    }
    this.updateToggleState(!this.expanded);
    if (this.onStateChange) {
      this.onStateChange(this.expanded);
    }
  }

  generateView() {
    const button = ElementGenerator.generateButton(BUTTON, this.#onToggle.bind(this));
    ElementHandler.setID(button, this.id);
    this.#setDisplay(button);
    ElementHandler.setDisabled(button, this.disabled);
    return button;
  }

  updateDisabledState(disabled) {
    this.disabled = disabled;
    this.documentElement.then(button => {
      ElementHandler.setDisabled(button, this.disabled);
    }).catch(() => { });
  }

  updateToggleState(expanded) {
    this.expanded = expanded;
    this.#updateDisplay();
  }

}
