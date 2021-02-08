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
import { OnlineIndicator } from "../online-indicator-controller/online-indicator-controller";

export class HeaderActionsControllerUser extends HeaderActionsController {
  #actionsListeners = {};

  constructor(gameSettings = true, actionsListeners = {}) {
    super(gameSettings);
    this.#actionsListeners = actionsListeners;

   this.onlineIndicator = new OnlineIndicator();


    console.log(self.onlineConnection.live);


  }



  get actions() {
    const fragment = document.createDocumentFragment();
    
    const onlineIndicator = this.onlineIndicator.generateView();

    fragment.append(onlineIndicator);

    fragment.append(this.settingsController.generateView());


    const connect = ElementGenerator.generateButton(BUTTONS.connect, this.#onConnect.bind(this));
    // ElementHandler.setDisabled(connect, true);
    fragment.append(connect);



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

  #onConnect() {
    console.log("#onConnect");

  }

}
