"use strict";

import {
  ElementHandler,
  ElementGenerator
} from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  CONTENT
} from "./invitations-controller.constants";

export class InvitationsControllerViewHelper {

  static generateHeader(invitationsNumber = 0) {
    const header = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.header]);
    header.innerHTML = CONTENT.header;

    const invitationsIndicator = InvitationsControllerViewHelper.generateHeaderIndicator(invitationsNumber);
    header.append(invitationsIndicator);

    return header;
  }

  static generateHeaderIndicator(invitationsNumber = 0) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.headerIndicator], DOM_ELEMENT_ID.headerIndicator);
    InvitationsControllerViewHelper.setHeaderIndicatorContent(container, invitationsNumber);
    return container;
  }

  static updateHeaderIndicator(invitationsNumber = 0) {
    return ElementHandler.getByID(DOM_ELEMENT_ID.headerIndicator).then(container => {
      InvitationsControllerViewHelper.setHeaderIndicatorContent(container, invitationsNumber);
      return;
    });
  }

  static setHeaderIndicatorContent(container, invitationsNumber = 0) {
    ElementHandler.clearContent(container);
    if (invitationsNumber) {
      container.innerHTML = `(${invitationsNumber.toString()})`;
    }
  }




}
