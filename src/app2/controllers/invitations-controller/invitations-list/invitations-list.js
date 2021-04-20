"use strict";
import { ElementHandler } from "HTML_DOM_Manager";
import { InvitationAction } from "~/_enums/invitation-action.enum";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./invitations-list.constants";
import { InvitationListItem } from "./invitation-list-item/invitation-list-item";

export class InvitationsList {
  #eventListeners = {};
  #InvitationsList = [];
  #_contentHeight = 0;
  #maxAllowedHeight;

  constructor(invitations, eventListeners = {}) {
    this.#eventListeners = eventListeners;
    this.#setInvitations(invitations);
    this.#maxAllowedHeight = Math.floor(document.documentElement.clientHeight * 0.85);
  }

  get #listElement() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.list);
  }

  get #styles() {
    const styles = [DOM_ELEMENT_CLASS.list];
    if (this.#scrollable) {
      styles.push(DOM_ELEMENT_CLASS.listScrollable);
    }
    return styles;
  }

  get #listContentHeight() {
    return this.#_contentHeight;
  }

  get #scrollable() {
    return this.#listContentHeight > this.#maxAllowedHeight;
  }

  get listHeight() {
    if (this.#scrollable) {
      return this.#maxAllowedHeight;
    }
    return this.#listContentHeight;
  }

  #setlistContentHeight() {
    const itemsHeights = this.#InvitationsList.map(invitationItem => invitationItem.height);
    this.#_contentHeight = itemsHeights.reduce((a, b) => a + b, 0);
  }

  #setStyles(list) {
    ElementHandler.setStyleClass(list, this.#styles);
  }

  #generateListItem(data) {
    return new InvitationListItem(data, {
      onHeightChange: this.#onHeightChange.bind(this),
      onAction: this.#onListItemAction.bind(this)
    });
  }

  #setInvitations(invitations) {
    invitations.forEach(invitation => {
      this.#InvitationsList.push(this.#generateListItem(invitation));
    });
    this.#setlistContentHeight();
  }

  #onHeightChange() {
    this.#setlistContentHeight();
    if (this.#eventListeners.onBeforeHeightChange) {
      this.#eventListeners.onBeforeHeightChange();
      return;
    }
    this.updateListHeight();
  }

  #onListItemAction(actionType, id) {
    this.#removeFromInvitations(id).then(() => {
      if (this.#eventListeners.onInvitationAction) {
        this.#eventListeners.onInvitationAction(InvitationAction[actionType], id);
        return;
      }
    });
  }

  #removeFromInvitations(invitationId) {
    const listItem = this.#InvitationsList.find(item => item.id === invitationId);
    return listItem.remove().then(() => {
      this.#InvitationsList = this.#InvitationsList.filter(item => item.id !== invitationId);
      this.#setlistContentHeight();
      return;
    });
  }

  addInList(data) {
    const newInvitation = this.#generateListItem(data);
    this.#InvitationsList.push(newInvitation);
    return this.#listElement.then(list => {
      list.append(newInvitation.generateView());
      this.#setlistContentHeight();
      return;
    });
  }

  updateListHeight() {
    return this.#listElement.then(list => {
      ElementHandler.setElementHeight(list, this.listHeight);
      this.#setStyles(list);
      return list;
    });
  }

  generateView() {
    const ul = document.createElement("ul");
    ElementHandler.setID(ul, DOM_ELEMENT_ID.list);
    this.#setStyles(ul);

    this.#InvitationsList.forEach(invitation => {
      ul.append(invitation.generateView());
    });

    return ul;
  }
}
