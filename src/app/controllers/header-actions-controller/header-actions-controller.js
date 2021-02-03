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



export class HeaderActionsController {
  #onLogout;
  
  constructor(onLogout) {
    this.#onLogout = onLogout;
    console.log("HeaderActionsController");
    // console.log(self.user);
    this.invitationsToggle = new Toggle("invitations");
    this.settingsToggle = new Toggle("settings");
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
      
      const invitations = this.invitationsToggle.generateView();
      const settingsToggle = this.settingsToggle.generateView();

      
      
      console.log(this.invitationsToggle);
      navigation.append(home, connect, invitations, settingsToggle, loggout);

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
