"use strict";

import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";


import { InvitationAction } from "~/_enums/invitation-action.enum";
import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  BUTTONS
} from "./invitations-controller.constants";
import {
  Toggle
} from "~/components/toggle/toggle";

import {
  User
} from "../../_models/user";

// import { InvitationListItem } from "./invitation-list-item/invitation-list-item";
import { InvitationsList } from "./invitations-list/invitations-list";


export class InvitationsController {
  #Toggle;
  #InvitationsList;
  #invitations = [];


 

  constructor() {
    console.log("InvitationsController");
    this.#Toggle = new Toggle("invitations", false, true, false);

    this.#invitations = [...self.onlineConnection.invitations];
    
    this.#InvitationsList = new InvitationsList([...self.onlineConnection.invitations], {
      onBeforeHeightChange: this.#onHeightChange.bind(this),
      onInvitationAction: this.#onInvitationAction.bind(this)
    });
  }

  
  generateView() {
    const list = this.#InvitationsList.generateView();
    return this.#Toggle.generateView(list);
  }

  #onHeightChange() {
    return this.#Toggle.updatePanelHeight(this.#InvitationsList.listHeight).then(() => {
      return this.#InvitationsList.updateListHeight();
    });
  }

  #onInvitationAction(actionType, invitation) {
    this.#onHeightChange();
    console.log("onInvitationAction");
    console.log(actionType);
    console.log(invitation);
    console.log(this.#invitations);
    console.log(self.onlineConnection.invitations);
    
    const testinv = JSON.parse(JSON.stringify(this.#invitations[1]));
    testinv.id = "testId";
    
    console.log(testinv);

  }

  

}
