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


  #generateHeader() {
    const header = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.header]);
    header.innerHTML = CONTENT.header;

    const invitationsIndicator = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.headerIndicator],DOM_ELEMENT_ID.headerIndicator);
    if (this.#invitations.length) {
      invitationsIndicator.innerHTML = `(${this.#invitations.length.toString()})`;
    }
    header.append(invitationsIndicator);

    return header;
  }


  generateView() {
    const fragment = document.createDocumentFragment();
    const header = this.#generateHeader();
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
    console.log("onInvitationAction");
    console.log(actionType);
    console.log(invitation);
    console.log(this.#invitations);
    console.log(self.onlineConnection.invitations);

    //this.testNewInvitationArrival();
  }


  testNewInvitationArrival() {
    const testinv = JSON.parse(JSON.stringify(this.#invitations[1]));
    testinv.id = "testId";

    console.log(testinv);
    setTimeout(() => {

      this.#onInvitationReceived(testinv);
    }, 1000);

  }


  #onInvitationReceived(invitation) {
    this.#InvitationsList.addInList(invitation).then(() => {
      if (this.#Toggle.expanded) {
        this.#onHeightChange();
      } else {
        this.#InvitationsList.updateListHeight();
      }
    });
  }

}
