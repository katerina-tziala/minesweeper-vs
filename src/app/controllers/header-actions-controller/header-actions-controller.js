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



export class HeaderActionsController {
  #onLogout;
  
  constructor(onLogout) {
    this.#onLogout = onLogout;
    console.log("HeaderActionsController");
    // console.log(self.user);
  }

  get #container() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.navigation);
  }

  generateView() {
    this.#container.then(navigation => {
      ElementHandler.clearContent(navigation);


      const connect = ElementGenerator.generateButton(BUTTONS.connect, this.#onConnect.bind(this));
      const settings = ElementGenerator.generateButton(BUTTONS.settings, this.#onToggleSettings.bind(this));

      const home = ElementGenerator.generateButton(BUTTONS.home, this.#onNavigateToHome.bind(this));
      const loggout = ElementGenerator.generateButton(BUTTONS.loggout, this.#onLogout.bind(this));
      const invitations = ElementGenerator.generateButton(BUTTONS.invitations, this.#onToggleInvitations.bind(this));

      navigation.append(home, connect, invitations, settings, loggout);

     // console.log(navigation);
    });
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


}
