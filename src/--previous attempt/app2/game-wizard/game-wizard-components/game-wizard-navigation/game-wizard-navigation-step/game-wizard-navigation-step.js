"use strict";
import { clone, replaceStringParameter } from "~/_utils/utils.js";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  BUTTONS,
  CONTENT
} from "./game-wizard-navigation-step.constants";

export class GameWizardNavigationStep {
  #submitSelected;

  constructor(name, submitSelected) {
    this.name = name;
    this.completed = false;
    this.disabled = true;
    this.displayed = true;
    this.selected = false;
    this.#submitSelected = submitSelected;
  }

  get #id() {
    return DOM_ELEMENT_ID.container + this.name;
  }

  get #container() {
    return ElementHandler.getByID(this.#id);
  }

  get #buttonId() {
    return DOM_ELEMENT_ID.button + this.name;
  }

  get #button() {
    return ElementHandler.getByID(this.#buttonId);
  }

  get #buttonParams() {
    const params = clone(BUTTONS.icon);
    params.id = this.#buttonId;
    return this.#getButtonParamsWithAriaLabel(params);
  }

  #getButtonParamsWithAriaLabel(params) {
    params.attributes["aria-label"] = replaceStringParameter(params.attributes["aria-label"], this.#content);
    return params;
  }

  get #labelParams() {
    const params = clone(BUTTONS.label);
    params.id = this.#labelId;
    return this.#getButtonParamsWithAriaLabel(params);
  }

  get #labelId() {
    return DOM_ELEMENT_ID.label + this.name;
  }

  get #label() {
    return ElementHandler.getByID(this.#labelId);
  }

  get #content() {
    return CONTENT[this.name];
  }

  get #buttonDisabled() {
    return this.disabled || this.selected;
  }

  get #stateStyles() {
    const stateStyles = [];

    if (this.completed) {
      stateStyles.push(DOM_ELEMENT_CLASS.completed);
    }

    if (this.selected) {
      stateStyles.push(DOM_ELEMENT_CLASS.selected);
    }

    return stateStyles;
  }

  get #buttonStyles() {
    let buttonStyles = [
      DOM_ELEMENT_CLASS.button,
      DOM_ELEMENT_CLASS.buttonModifier + this.name
    ];

    buttonStyles.concat(this.#stateStyles);
    return buttonStyles;
  }

  get #containerStyles() {
    const styles = this.#stateStyles;
    styles.push(DOM_ELEMENT_CLASS.container);
    return styles;
  }

  #generateLabel() {
    const button = ElementGenerator.generateButton(this.#labelParams, this.#onSelection.bind(this));
    button.innerHTML = this.#content;
    ElementHandler.setDisabled(button, this.#buttonDisabled);
    return button;
  }

  #generateButton() {
    const button = ElementGenerator.generateButton(this.#buttonParams, this.#onSelection.bind(this));
    ElementHandler.setStyleClass(button, this.#buttonStyles);
    ElementHandler.setDisabled(button, this.#buttonDisabled);
    return button;
  }

  #onSelection() {
    this.completed = true;
    this.setSelected(true).then(() => {
      if (this.#submitSelected) {
        this.#submitSelected(this);
      }
    });
  }

  #updateStyles() {
    const updates = [this.#updateContainerStyles(), this.#updateButtonStyles()];
    return Promise.all(updates);
  }

  #updateContainerStyles() {
    return this.#container.then(container => {
      ElementHandler.setStyleClass(container, this.#containerStyles);
      return;
    });
  }

  #updateButtonStyles() {
    return this.#button.then(button => {
      ElementHandler.setStyleClass(button, this.#buttonStyles);
      return;
    });
  }

  #setStepDisplay(container) {
    this.displayed
      ? ElementHandler.display(container)
      : ElementHandler.hide(container);
  }

  generateView() {
    const container = ElementGenerator.generateContainer(this.#containerStyles, this.#id);
    const button = this.#generateButton();
    const label = this.#generateLabel();
    container.append(button, label);
    this.#setStepDisplay(container);
    return container;
  }

  setSelected(selected) {
    this.selected = selected;
    return this.#updateStyles();
  }

  setCompleted(completed) {
    this.completed = completed;
    return this.#updateStyles();
  }

  updateDisabled() {
    const elements = [this.#button, this.#label];
    return Promise.all(elements).then(buttonElements => {
      buttonElements.forEach(button => {
        ElementHandler.setDisabled(button, this.#buttonDisabled);
      });
      return;
    });
  }

  setDisplayed(displayed) {
    this.displayed = displayed;
    return this.#container.then(container => {
      this.#setStepDisplay(container);
    });
  }

}
