"use strict";
import { clone, replaceStringParameter } from "~/_utils/utils.js";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  BUTTON_PARAMS,
  CONTENT
} from "./game-wizard-navigation-step.constants";


export class GameWizardNavigationStep {

  constructor(name) {
    this.name = name;
    this.completed = false;
    this.disabled = true;
    this.displayed = true;
    this.selected = false;
  }

  get #id() {
    return DOM_ELEMENT_ID.container + this.name;
  }

  get #buttonId() {
    return DOM_ELEMENT_ID.button + this.name;
  }

  get #buttonParams() {
    const params = clone(BUTTON_PARAMS);
    params.id = this.#buttonId;
    params.attributes["aria-label"] = replaceStringParameter(params.attributes["aria-label"], this.#content);
    return params;
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

  generateView() {
    const container = ElementGenerator.generateContainer(this.#containerStyles, this.#id);
    const button = this.#generateButton();
    const label = this.#generateLabel();
    container.append(button, label);
    return container;
  }

  #generateLabel() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.label]);
    container.innerHTML = this.#content;
    return container;
  }


  #generateButton() {
    const button = ElementGenerator.generateButton(this.#buttonParams);
    ElementHandler.setStyleClass(button, this.#buttonStyles);
    ElementHandler.setDisabled(button, this.#buttonDisabled);
    return button;
  }












}
