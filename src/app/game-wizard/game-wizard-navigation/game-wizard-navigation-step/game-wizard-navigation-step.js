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

  generateView() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], this.#id);



    container.append(this.#generateButton());
    return container;
  }

  #generateButton() {
    const button = ElementGenerator.generateButton(this.#buttonParams);
    ElementHandler.setStyleClass(button, this.#buttonStyles);
    
    ElementHandler.setDisabled(button, this.disabled || this.selected);
    return button;
  }


  get #buttonStyles() {
    const buttonStyles = [
      DOM_ELEMENT_CLASS.button,
      DOM_ELEMENT_CLASS.buttonModifier + this.name
    ];
    if (this.selected) {
      buttonStyles.push(DOM_ELEMENT_CLASS.buttonSelected);
    }

    return buttonStyles;
  }











}
