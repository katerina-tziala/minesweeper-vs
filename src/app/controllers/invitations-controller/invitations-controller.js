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
  CONTENT
} from "./invitations-controller.constants";
import {
  Toggle
} from "~/components/toggle/toggle";

import {
  User
} from "../../_models/user";


import { InvitationsList } from "./invitations-list/invitations-list";

import { InvitationsControllerViewHelper as ViewHelper } from "./invitations-controller-view-helper";

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
    const fragment = document.createDocumentFragment();
    const header = ViewHelper.generateHeader(this.#invitations.length);
    const list = this.#InvitationsList.generateView();
    fragment.append(header, list);
    return this.#Toggle.generateView(fragment);
  }

  #onHeightChange() {
    return this.#Toggle.updatePanelHeight(this.#InvitationsList.listHeight + 30).then(() => {
      return this.#InvitationsList.updateListHeight();
    });
  }

  #onInvitationAction(actionType, invitation) {
    this.#onHeightChange();
    this.#invitations = this.#invitations.filter(currentInvitation => currentInvitation.id !== invitation.id);
    ViewHelper.updateHeaderIndicator(this.#invitations.length);

    console.log("onInvitationAction");
    console.log(actionType);
    console.log(invitation);

    console.log(self.onlineConnection.invitations);

    
    console.log(this.#invitations);
    this.testNewInvitationArrival();
  }




  // 
  testNewInvitationArrival() {
    const testinv = JSON.parse(JSON.stringify(this.#invitations[1]));
    testinv.id = "testId";

    console.log(testinv);
    setTimeout(() => {

      this.#onInvitationReceived(testinv);
    }, 1000);

  }


  #onInvitationReceived(invitation) {
    this.#invitations.push(invitation);
    ViewHelper.updateHeaderIndicator(this.#invitations.length);


    this.#InvitationsList.addInList(invitation).then(() => {
      if (this.#Toggle.expanded) {
        this.#onHeightChange();
      } else {
        this.#InvitationsList.updateListHeight();
      }
    });
  }

}
