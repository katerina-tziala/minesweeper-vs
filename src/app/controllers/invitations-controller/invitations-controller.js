"use strict";
import { ElementHandler } from "HTML_DOM_Manager";
import { InvitationAction } from "~/_enums/invitation-action.enum";

import { Toggle } from "~/components/toggle/toggle";
import { InvitationsList } from "./invitations-list/invitations-list";

import { HEIGHT_CONFIG } from "./invitations-controller.constants";
import { InvitationsControllerViewHelper as ViewHelper } from "./invitations-controller-view-helper/invitations-controller-view-helper";

export class InvitationsController {
  #Toggle;
  #ListHandler;
  #invitations = [];

  constructor() {
    this.#Toggle = new Toggle("invitations", false, true, false);
    this.#Toggle.onStateChange = this.#onToggleChange.bind(this);
    this.#invitations = [...self.onlineConnection.invitations];

    //get data from online connection from the app
  }

  #setInvitationsList() {
    this.#ListHandler = new InvitationsList([...this.#invitations], {
      onBeforeHeightChange: this.#onListHeightChange.bind(this),
      onInvitationAction: this.#onInvitationAction.bind(this)
    });
  }

  #generateContentContainer() {
    const contentContainer = ViewHelper.generateContainer();
    if (this.#invitations.length) {
      this.#setInvitationsList();
      contentContainer.append(this.#ListHandler.generateView());
    } else {
      const noInvitationsMessage = ViewHelper.generateNoInvitationMessage();
      contentContainer.append(noInvitationsMessage);
    }
    return contentContainer;
  }

  #generateButtonIndicator() {
    const buttonIndicator = ViewHelper.generateButtonIndicator(this.#invitations.length);
    this.#setButtonIndicatorDisplay(buttonIndicator);
    return buttonIndicator;
  }

  #generateToggleContent() {
    const fragment = document.createDocumentFragment();
    const header = ViewHelper.generateHeader(this.#invitations.length);
    const contentContainer = this.#generateContentContainer();
    fragment.append(header, contentContainer);
    return fragment;
  }

  generateView() {
    const toggleContent = this.#generateToggleContent();
    const toggle = this.#Toggle.generateView(toggleContent);
    const buttonIndicator = this.#generateButtonIndicator();
    console.log(toggle);
    toggle.append(buttonIndicator);
    return toggle;
  }

  get #contentHeight() {
    let height = HEIGHT_CONFIG.header;
    height += this.#ListHandler ? this.#ListHandler.listHeight : HEIGHT_CONFIG.noInvitationMessage;
    return height;
  }

  #updateToggleHeight() {
    if (this.#Toggle.expanded) {
      return this.#Toggle.updatePanelHeight(this.#contentHeight);
    }
    return Promise.resolve();
  }

  #onListHeightChange() {
    return this.#updateToggleHeight().then(() => {
      return this.#ListHandler.updateListHeight();
    });
  }

  #setButtonIndicatorDisplay(buttonIndicator) {
    this.#Toggle.expanded || !this.#invitations.length
    ? ElementHandler.hide(buttonIndicator)
    : ElementHandler.display(buttonIndicator);
  }

  #updateButtonIndicator() {
    ViewHelper.updateButtonIndicator(this.#invitations.length).then(buttonIndicator => {
      this.#setButtonIndicatorDisplay(buttonIndicator);
    });
  }

  #updateInvitationIndicators() {
    ViewHelper.updateHeaderIndicator(this.#invitations.length);
    this.#updateButtonIndicator();
  }

  #removeInvitation(id) {
    this.#invitations = this.#invitations.filter(invitation => invitation.id !== id);
    this.#updateInvitationIndicators();

    if (!this.#invitations.length) {
      this.#ListHandler = undefined;
      return ViewHelper.setNoInvitationsContent().then(() => {
        return this.#updateToggleHeight();
      });
    }

    this.#onListHeightChange();
  }

  #onToggleChange() {
    this.#updateButtonIndicator();
  }

  #onInvitationAction(actionType, id) {
    this.#removeInvitation(id);
    console.log("handle invitation online");
    console.log(actionType);
    console.log(InvitationAction[actionType]);
    console.log(id);
    // console.log(invitation);
    // console.log(self.onlineConnection.invitations);
    // console.log(this.#invitations);
    
    //this.testupdate();
  }

  #addInvitationInList(invitation) {
    this.#ListHandler.addInList(invitation).then(() => {
      if (this.#Toggle.expanded) {
        this.#onListHeightChange();
      } else {
        this.#ListHandler.updateListHeight();
      }
    });
  }

  #onInvitationReceived(invitation) {
    this.#invitations.push(invitation);
    this.#updateInvitationIndicators();

    if (this.#ListHandler) {
      this.#addInvitationInList(invitation);
      return;
    }

    this.#setInvitationsList();
    return ViewHelper.getClearedContainer().then(container => {
      container.append(this.#ListHandler.generateView());
      return this.#updateToggleHeight();
    });
  }

}
