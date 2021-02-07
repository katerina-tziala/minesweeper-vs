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
  #toggle;

  constructor() {
    console.log("InvitationsController");
    this.#toggle = new Toggle("invitations");
 
    this.invitations = [
      {
        id: "inv1",
        from: new User("testid", "katerina"),
        to: new User("kate", "kate"),
        gameData: {}
      },
      {
        id: "inv2",
        from: new User("testid2", "katerina2"),
        to: new User("kate2", "kate2"),
        gameData: {}
      }
    ]
    
  }

  
  generateView() {
    return this.#toggle.generateView();
  }


  invitationsList() {
    const fragment = document.createDocumentFragment();



    return fragment;
  }






}
