"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { GameAction } from "GameEnums";
import {
  BUTTONS,
  DOM_ELEMENT_CLASS,
} from "./board-actions-controller.constants";

export class BoardActionsController {
  #_online;
  #_actionsAllowed;
  #onAction;

  constructor(actionsAllowed = false, online = false, onAction) {
    this.#actionsAllowed = actionsAllowed;
    this.#online = online;
    this.#onAction = onAction;
  }

  set #online(online) {
    return this.#_online = online;
  }

  get #online() {
    return this.#_online;
  }

  set #actionsAllowed(allowed) {
    return this.#_actionsAllowed = allowed;
  }

  get #actionsAllowed() {
    return this.#_actionsAllowed;
  }

  get #buttons() {
    if (!this.#actionsAllowed) {
      return [];
    }

    const actionButtons = [];

    actionButtons.push(this.#generatedExitButton);
    if (!this.#online) {
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
    return this.#generateActionButton(BUTTONS.exit, this.#onQuit.bind(this));
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

  #onQuit() {
    this.#submitAction(GameAction.Quit);
  }

  #onRestart() {
    this.#submitAction(GameAction.Restart);
  }

  #onReset() {
    this.#submitAction(GameAction.Reset);
  }

  #submitAction(actionType) {
    if (this.#onAction && actionType) {
      this.#onAction(actionType);
    }
  }

  generateView() {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.container,
    ]);
    const buttons = this.#buttons;
    if (buttons.length) {
      buttons.forEach((button) => container.append(button));
    } else {
      ElementHandler.hide(container);
    }
    return container;
  }

}
