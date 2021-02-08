"use strict";

import { HeaderActionsController } from "./header-actions-controller";
import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  BUTTONS
} from "./header-actions-controller.constants";
import { OnlineIndicatorController } from "../online-indicator-controller/online-indicator-controller";

export class HeaderActionsControllerUser extends HeaderActionsController {
  #actionsListeners = {};
  #OnlineIndicator;

  constructor(gameSettings = true, actionsListeners = {}) {
    super(gameSettings);
    this.#actionsListeners = actionsListeners;

    this.#OnlineIndicator = new OnlineIndicatorController();


    console.log(self.onlineConnection.live);

  }

  get #onlineIndicatorElement() {
    return this.#OnlineIndicator.generateView();
  }

  setOnlineIndicatorState() {
    return this.#OnlineIndicator.updateState();
  }


  get actions() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.#onlineIndicatorElement);

    fragment.append(this.settingsElement);

    if (self.user) {
      fragment.append(ElementGenerator.generateButton(BUTTONS.loggout, this.#onLogout.bind(this)));
    }

    return fragment;
  }


  #onLogout() {
    if (this.#actionsListeners.onLogout) {
      this.#actionsListeners.onLogout();
    }
  }

  







}
