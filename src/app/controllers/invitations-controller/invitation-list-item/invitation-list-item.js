"use strict";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { InvitationAction } from "~/_enums/invitation-action.enum";
import { Toggle } from "~/components/toggle/toggle";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, ACTION_BUTTONS } from "./invitation-list-item.constants";

import { InvitationContent } from "./invitation-content/invitation-content";

export class InvitationListItem {
  #invitation;
  #id;
  #Toggle;
  #onHeightChange;

  constructor(invitation, onHeightChange) {
    this.#invitation = invitation;
    this.#id = DOM_ELEMENT_ID.item + this.#invitation.id;

    this.#onHeightChange = onHeightChange;


    this.#Toggle = new Toggle(this.#id, false, false);
    this.#Toggle.onStateChange = this.#onToggleDetails.bind(this);
    // console.log("InvitationListItem");
    // console.log(invitation);
    // this.#Toggle = new Toggle("invitations", false, true);
    // this.#invitations = self.onlineConnection.invitations;
  }


  get #sender() {
    return this.#invitation.sender;
  }

  get #listItem() {
    return ElementHandler.getByID(this.#id);
  }

  #generateInvitationDetails() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.details]);
    const header = InvitationContent.generateInvitationHeader(this.#sender);
    const createdAt = InvitationContent.generateReceivedInfo(this.#invitation.createdAt);
    container.append(header, createdAt);
    return container;
  }

  #generateMainContent() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.contentContainer]);
    const iconToggle = this.#generateToggleView();
    const details = this.#generateInvitationDetails();
    const actions = this.#generateInvitationActions();
    container.append(iconToggle, details, actions);
    return container;
  }

  #generateInvitationActions() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.actions]);
    Object.values(InvitationAction).forEach(actionType => {
      const button = ElementGenerator.generateButton(ACTION_BUTTONS[actionType], () => this.#onInvitationAction(actionType));
      container.append(button);
    });
    return container;
  }

  #generateToggleView() {
    const gameDetails = InvitationContent.generateGameInfo(this.#invitation.game);
    return this.#Toggle.generateView(gameDetails);
  }

  #onToggleDetails(expanded) {


    console.log("onToggleDetails");

    this.#Toggle.contentHeight.then(height => {
      const heightUpdate = expanded ? height : -height;
      return this.#updateItemHeight(heightUpdate);
    }).then(() => {
      if (this.#onHeightChange) {
        this.#onHeightChange();
      }
    });
  }

  #updateItemHeight(heightAddition) {
    return this.#listItem.then(listItem => {
      const currentHeight = listItem.getBoundingClientRect().height;
      const newHeight = currentHeight + heightAddition;
      ElementHandler.setElementHeight(listItem, newHeight);
      return;
    });
  }



  #onInvitationAction(actionType) {
    console.log("onInvitationAction");
    console.log(actionType);
    // console.log(this.#invitation);
  }




  generateView() {
    const invitationItem = document.createElement("li");
    ElementHandler.addStyleClass(invitationItem, DOM_ELEMENT_CLASS.item);
    ElementHandler.setID(invitationItem, this.#id);
    invitationItem.append(this.#generateMainContent());
    return invitationItem;
  }

}
