"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import {
  BUTTONS,
  DOM_ELEMENT_CLASS,
} from "./board-actions-controller.constants";

export class BoardActionsController {
  constructor(online = false) {
    this.online = online;
  }

  generateView() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.#boardActions);
    return fragment;
  }

  get #boardActions() {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.container,
    ]);
    const buttons = this.buttons;
    if (buttons.length) {
      buttons.forEach((button) => container.append(button));
    } else {
      ElementHandler.hide(container);
    }
    return container;
  }

  get buttons() {
    const actionButtons = [];
    actionButtons.push(this.#generatedExitButton);
    if (!this.online) {
      actionButtons.push(this.#generatedRestartButton);
      actionButtons.push(this.#generatedResetButton);
    }
    return actionButtons;
  }

  #generateActionButton(params, action) {
    const actionButton = ElementGenerator.generateButton(params, action);
    ElementHandler.addStyleClass(actionButton, DOM_ELEMENT_CLASS.actionButton);
    return actionButton;
  }

  get #generatedExitButton() {
    return this.#generateActionButton(BUTTONS.exit, this.#onExit.bind(this));
  }

  get #generatedRestartButton() {
    return this.#generateActionButton(
      BUTTONS.restart,
      this.#onRestart.bind(this),
    );
  }

  get #generatedResetButton() {
    return this.#generateActionButton(BUTTONS.reset, this.#onReset.bind(this));
  }

  #onExit() {
    console.log("onExit");
  }

  #onRestart() {
    console.log("onRestart");
  }

  #onReset() {
    console.log("onReset");
  }
}
