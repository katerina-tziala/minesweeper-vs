"use strict";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { InvitationAction } from "~/_enums/invitation-action.enum";
import { Toggle } from "~/components/toggle/toggle";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, ACTION_BUTTONS } from "./invitation-list-item.constants";

import { InvitationContent } from "./invitation-content/invitation-content";
import { timeoutPromise } from "~/_utils/utils";
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
    this.#Toggle.onAnimationEnd = this.#onToggleAnimationEnd.bind(this);
  }

  get #sender() {
    return this.#invitation.sender;
  }

  get #listItem() {
    return ElementHandler.getByID(this.#id);
  }

  #generateContent() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.contentContainer]);
    const iconToggle = this.#generateToggleView();
    const details = InvitationContent.generateInvitationDetails(this.#sender, this.#invitation.createdAt);
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
      height = height + 10;
      const heightUpdate = expanded ? height : -height;
      if (this.#onHeightChange) {
        this.#onHeightChange(heightUpdate);
      }
      return this.#updateItemHeight(heightUpdate);
    });
  }

  #onToggleAnimationEnd() {
    console.log("onToggleAnimationEnd");
  }



  #updateItemHeight(heightAddition) {
    return this.#listItem.then(listItem => {
      const currentHeight = ElementHandler.getElementHeight(listItem);
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
    invitationItem.append(this.#generateContent());
    return invitationItem;
  }

}
