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
} from "../../components/toggle/toggle";

import {
  User
} from "../../_models/user";



export class InvitationsController {
  #Toggle;
  #invitations = [];



  constructor() {
    console.log("InvitationsController");
    this.#Toggle = new Toggle("invitations");
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


      console.log(invitation);


      
    });


    fragment.append(ul);
    return fragment;
  }








}
