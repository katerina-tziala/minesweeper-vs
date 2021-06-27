"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants.js";
import {
  ElementHandler,
  ElementGenerator
} from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  CONTENT
} from "./invitations-controller-view-helper.constants";

export class InvitationsControllerViewHelper {

  static #getHeaderIndicatorContent(invitationsNumber = 0) {
    if (invitationsNumber) {
      return `(${invitationsNumber.toString()})`;
    }
    return TYPOGRAPHY.emptyString;
  }

  static #getButtonIndicatorContent(invitationsNumber = 0) {
    const content = invitationsNumber.toString();
    return content.length > 2 ? TYPOGRAPHY.ellipsis : content;
  }

  static #setIndicatorContent(container, content = TYPOGRAPHY.emptyString) {
    ElementHandler.clearContent(container);
    container.innerHTML = content;
  }

  static #updateIndicator(id, content) {
    return ElementHandler.getByID(id).then(container => {
      InvitationsControllerViewHelper.#setIndicatorContent(container, content);
      return container;
    });
  }

  static generateHeader(invitationsNumber = 0) {
    const header = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.header]);
    header.innerHTML = CONTENT.header;

    const invitationsIndicator = InvitationsControllerViewHelper.generateHeaderIndicator(invitationsNumber);
    header.append(invitationsIndicator);

    return header;
  }

  static generateHeaderIndicator(invitationsNumber = 0) {
    const content = InvitationsControllerViewHelper.#getHeaderIndicatorContent(invitationsNumber);
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.headerIndicator], DOM_ELEMENT_ID.headerIndicator);
    InvitationsControllerViewHelper.#setIndicatorContent(container, content);
    return container;
  }

  static updateHeaderIndicator(invitationsNumber = 0) {
    const content = InvitationsControllerViewHelper.#getHeaderIndicatorContent(invitationsNumber);
    return InvitationsControllerViewHelper.#updateIndicator(DOM_ELEMENT_ID.headerIndicator, content);
  }

  static generateButtonIndicator(invitationsNumber = 0) {
    const content = InvitationsControllerViewHelper.#getButtonIndicatorContent(invitationsNumber);
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.buttonIndicator], DOM_ELEMENT_ID.buttonIndicator);
    InvitationsControllerViewHelper.#setIndicatorContent(container, content);
    return container;
  }

  static updateButtonIndicator(invitationsNumber = 0) {
    const content = InvitationsControllerViewHelper.#getButtonIndicatorContent(invitationsNumber);
    return InvitationsControllerViewHelper.#updateIndicator(DOM_ELEMENT_ID.buttonIndicator, content);
  }

  static generateContainer() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_CLASS.container);
    return container;
  }

  static get clearedContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container).then(container => {
      ElementHandler.clearContent(container);
      return container;
    });
  }

  static setNoInvitationsContent() {
    return InvitationsControllerViewHelper.clearedContainer.then(container => {
      container.append(InvitationsControllerViewHelper.generateNoInvitationMessage());
      return;
    });
  }

  static generateNoInvitationMessage() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.noInvitations]);
    container.innerHTML = CONTENT.noInvitations;
    return container;
  }

  static initParentContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.invitations).then(container => {
      ElementHandler.clearContent(container);
      return container;
    });
  }

}
