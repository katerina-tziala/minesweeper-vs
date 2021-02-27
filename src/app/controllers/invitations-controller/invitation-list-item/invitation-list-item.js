"use strict";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS, CONTENT } from "./invitation-list-item.constants";

import { InvitationContent } from "~/components/invitation-content/invitation-content";




export class InvitationListItem {

  static generateView(invitation) {
    const invitationItem = document.createElement("li");
    ElementHandler.addStyleClass(invitationItem, "invitation-list-item");

 
    
    const content = InvitationListItem.generateContent(invitation);
    //console.log(invitation);
    invitationItem.append(content);
    return invitationItem;
  }


  static generateContent(invitation) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.contentContainer]);
    const icon = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.icon]);
    const details = InvitationListItem.generateInvitationDetails(invitation);

    //console.log(invitation);
   //console.log(invitation.game);
    const invitationGame = invitation.game;
    //console.log(invitationGame);


    const levelSettings = invitationGame.levelSettings;
    const test = `level: ${levelSettings.level} (${levelSettings.rows}x${levelSettings.columns}), ${levelSettings.numberOfMines} mines`;
    
    //console.log(test);

    const turnSettings = invitationGame.turnSettings;

    //console.log(turnSettings);

    const optionsSettings = invitationGame.optionsSettings;

    //console.log(optionsSettings);

    container.append(icon, details);


    return container;
  }


  static generateInvitationDetails(invitation) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.details]);
    const header = InvitationContent.generateInvitationHeader(invitation.sender);
    const createdAt = InvitationContent.generateReceivedInfo(invitation.createdAt);


    container.append(header, createdAt);
    return container;
  }


  



}
