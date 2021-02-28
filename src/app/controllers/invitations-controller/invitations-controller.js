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
} from "./invitations-controller.constants";
import {
  Toggle
} from "~/components/toggle/toggle";

import {
  User
} from "../../_models/user";

import { InvitationListItem } from "./invitation-list-item/invitation-list-item";


export class InvitationsController {
  #Toggle;
  #invitations = [];

  #InvitationsList = [];


  constructor() {
    console.log("InvitationsController");
    this.#Toggle = new Toggle("invitations", false, true, false);
    this.#invitations = self.onlineConnection.invitations;
  }




  generateView() {
    return this.#Toggle.generateView(this.#generateInvitationsList());
  }


  #generateInvitationsList() {
    const fragment = document.createDocumentFragment();

    const ul = document.createElement("ul");
    ElementHandler.setID(ul, "invitations-list")
    ElementHandler.addStyleClass(ul, "invitations-list")

    this.#invitations.forEach(invitation => {
      const invitationItem = new InvitationListItem(invitation, this.#onListItemHeightChange.bind(this));
      this.#InvitationsList.push(invitationItem)
      // const invitationItem = invitationItem.generateView();


      ul.append(invitationItem.generateView());
    });


    fragment.append(ul);
    return fragment;
  }


  #onListItemHeightChange() {
   
    this.#Toggle.updatePanelHeight();
    // console.log("onListItemHeightChange");
    // console.log(height);
    


  }






}
