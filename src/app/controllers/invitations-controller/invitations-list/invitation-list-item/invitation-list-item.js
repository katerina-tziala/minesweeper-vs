"use strict";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { Toggle } from "~/components/toggle/toggle";
import { InvitationAction } from "~/_enums/invitation-action.enum";
import { InvitationContent } from "./invitation-content/invitation-content";
import { DOM_ELEMENT_CLASS, ACTION_BUTTONS, HEIGHT_CONFIG } from "./invitation-list-item.constants";
import { preventInteraction } from "~/_utils/utils";

export class InvitationListItem {
  #invitation;
  #Toggle;
  #eventListeners;
  detailsExpanded;

  constructor(invitation, eventListeners = {}) {
    this.#invitation = invitation;
    this.#eventListeners = eventListeners;
    this.id = this.#invitation.id;
    this.#Toggle = new Toggle(this.id, false, false);
    this.#Toggle.onStateChange = this.#onToggleDetails.bind(this);
    this.detailsExpanded = false;
    this.height = HEIGHT_CONFIG.initial;
  }

  get #sender() {
    return this.#invitation.sender;
  }

  get #listItem() {
    return ElementHandler.getByID(this.id);
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
    Object.keys(InvitationAction).forEach(actionType => {
      const buttonParams = ACTION_BUTTONS[actionType.toLowerCase()];
      const button = ElementGenerator.generateButton(buttonParams, (event) => {
        preventInteraction(event);
        this.#onInvitationAction(actionType);
      });
      container.append(button);
    });
    return container;
  }

  #generateToggleView() {
    const gameDetails = InvitationContent.generateGameInfo(this.#invitation.game);
    return this.#Toggle.generateView(gameDetails);
  }

  #setHeight() {
    return this.#Toggle.contentHeight.then(contentHeight => {
      const heightUpdate = contentHeight + HEIGHT_CONFIG.addition;
      this.height = this.detailsExpanded ? HEIGHT_CONFIG.initial + heightUpdate : HEIGHT_CONFIG.initial;
      return;
    });
  }

  #updateItemHeight() {
    return this.#listItem.then(listItem => {
      ElementHandler.setElementHeight(listItem, this.height);
      return listItem;
    });
  }

  #onToggleDetails(expanded) {
    this.detailsExpanded = expanded;
    this.#setHeight().then(() => {
      return this.#updateItemHeight();
    }).then(() => {
      if (this.#eventListeners.onHeightChange) {
        this.#eventListeners.onHeightChange();
      }
    });
  }

  #onInvitationAction(actionType) {
    if (this.#eventListeners.onAction) {
      this.#eventListeners.onAction(actionType, this.id);
    }
  }

  remove() {
    return this.#listItem.then(listItem => {
      listItem.remove();
      return;
    });
  }

  generateView() {
    const invitationItem = document.createElement("li");
    ElementHandler.addStyleClass(invitationItem, DOM_ELEMENT_CLASS.item);
    ElementHandler.setID(invitationItem, this.id);
    invitationItem.append(this.#generateContent());
    return invitationItem;
  }

}
