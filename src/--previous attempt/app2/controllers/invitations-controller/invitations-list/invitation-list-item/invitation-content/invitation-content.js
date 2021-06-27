"use strict";
import { ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS, CONTENT } from "./invitation-content.constants";
import { GameOptionsExplanationTable } from "~/components/game-options-explanation-table/game-options-explanation-table";

export class InvitationContent {

  static generateInvitationSender(sender) {
    return `<div class="${DOM_ELEMENT_CLASS.sender}">${sender.username}</div>`;
  }

  static generateInvitationText() {
    return `<div class="${DOM_ELEMENT_CLASS.text}">${CONTENT.text}</div>`;
  }

  static generateInvitationHeader(sender) {
    let headerContent = InvitationContent.generateInvitationSender(sender);
    headerContent += InvitationContent.generateInvitationText();
    return ElementGenerator.generateSecondLevelHeader(headerContent, [DOM_ELEMENT_CLASS.header]);
  }

  static generateReceivedInfo(receivedDate) {
    const receivedAt = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.receivedAt]);
    const date = new Date(receivedDate);
    const dateString = date.toLocaleString('en-GB', {
      day: "2-digit",
      month: 'short',
      year: 'numeric',
      hourCycle: "h24",
      hour: "2-digit",
      minute: "2-digit"
    });
    receivedAt.innerHTML = `${CONTENT.receivedAt}${dateString}`;
    return receivedAt;
  }

  static generateGameInfo(invitationGame) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.gameInfoContainer]);
    const table = GameOptionsExplanationTable.generateFullGameInfoTable(invitationGame);
    container.append(table);
    return container;
  }

  static generateInvitationDetails(sender, createdAt) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.details]);
    const header = InvitationContent.generateInvitationHeader(sender);
    const receivedAt = InvitationContent.generateReceivedInfo(createdAt);
    container.append(header, receivedAt);
    return container;
  }
}
