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
import {
  Toggle
} from "../../components/toggle/toggle";

import {
  InvitationsController
} from "../invitations-controller/invitations-controller";





export class HeaderActionsControllerUser extends HeaderActionsController {
  #actionsListeners = {};
  #OnlineIndicator;
  #InvitationsController;
  
  constructor(gameSettings = true, actionsListeners = {}) {
    super(gameSettings);
    this.#actionsListeners = actionsListeners;

    this.#OnlineIndicator = new OnlineIndicatorController();
    this.#InvitationsController = new InvitationsController();
    
    // console.log(self.onlineConnection.live);
  }

  get #onlineIndicatorElement() {
    return this.#OnlineIndicator.generateView();
  }

  get #invitationsToggle() {
    return this.#InvitationsController.generateView();
  }

  get actions() {
    const fragment = document.createDocumentFragment();
    //     const home = ElementGenerator.generateButton(BUTTONS.home, this.#onNavigateToHome.bind(this));
    fragment.append(this.#onlineIndicatorElement);
    fragment.append(this.#invitationsToggle);
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

  setOnlineIndicatorState() {
    return this.#OnlineIndicator.updateState();
  }


  #onNavigateToHome() {
    console.log("#onNavigateToHome");
    // LocalStorageHelper.remove("username");
    // self.user = undefined;
    //this.#onJoinNavigation();
  }





}
