"use strict";

import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";


import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  BUTTONS
} from "./header-actions-controller.constants";
import {
  Toggle
} from "../../components/toggle/toggle";

import {
  InvitationsController
} from "../invitations-controller/invitations-controller";

import {
  SettingsController
} from "../settings-controller/settings-controller";

export class HeaderActionsController {
  #invitationsController;
  #settingsController;

  constructor() {
   // this.#onLogout = onLogout;
    console.log("HeaderActionsController");
    // console.log(self.user);
    this.invitationsToggle = new Toggle("invitations");
    this.settingsToggle = new Toggle("settings");

    this.#invitationsController = new InvitationsController();

    this.#settingsController = new SettingsController(true);
  }

  get #container() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.navigation);
  }

  generateView() {
    this.#container.then(navigation => {
      ElementHandler.clearContent(navigation);


      const connect = ElementGenerator.generateButton(BUTTONS.connect, this.#onConnect.bind(this));
   
      const home = ElementGenerator.generateButton(BUTTONS.home, this.#onNavigateToHome.bind(this));
      const loggout = ElementGenerator.generateButton(BUTTONS.loggout, this.#onLogout.bind(this));
      
      const invitations = this.#invitationsController.generateView();
      const settingsToggle = this.#settingsController.generateView();

      // setTimeout(() => {
      //   this.hideGameSettings();
      // }, 1000);
      // setTimeout(() => {
      //   this.displayGameSettings();
      // }, 2000);

      navigation.append(home, connect, invitations, settingsToggle, loggout);

     // console.log(navigation);
    });
  }


  hideGameSettings() {
    console.log("#hideGameSettings");
    console.log("animate toggle");
    this.#settingsController.toggleGameSettingsDisplay(false);
  }

  displayGameSettings() {
    console.log("#displayGameSettings");
    console.log("animate toggle");
    this.#settingsController.toggleGameSettingsDisplay(true);
  }




  #onNavigateToHome() {
    console.log("#onNavigateToHome");
    // LocalStorageHelper.remove("username");
    // self.user = undefined;
    //this.#onJoinNavigation();
  }

  #onToggleSettings() {
    console.log("#onToggleSettings");
    
  }


  #onToggleInvitations() {
    console.log("#onToggleInvitations");
    
  }

  #onConnect() {
    console.log("#onConnect");
    
  }
  #onLogout() {
    console.log("#onLogout");
    
  }

}
