"use strict";
import { replaceStringParameter } from "~/_utils/utils";
import { GameMessageViewHelper as ViewHelper } from "../game-message-view-helper/game-message-view-helper";
import { GameMessageController } from "../game-message-controller";
import { MESSAGES, GAME_GOAL } from "./game-message-vs-controller.constants";

export class GameMessageVSController extends GameMessageController {

  constructor(vsMode) {
    super();
    this.vsMode = vsMode;
    this.messageDuration = 4000;
    this.gameMessages = MESSAGES;
  }


  getMessageWithUpdatedSubtitle(message) {
    message.subtitle = replaceStringParameter(
      message.subtitle,
      GAME_GOAL[this.vsMode],
    );
    return message;
  }

  getMessageForPlayer(message, player) {
    message = super.getMessageForPlayer(message, player);
    if (this.vsMode) {
      message = this.getMessageWithUpdatedSubtitle(message);
    }
    return message;
  }


   displayDrawMessage(player, opponent) {
    return this.display().then(container => {
      let message = this.getMessageForPlayer(this.gameMessages.gameOverDraw, player);
      message = this.setMessageContentForPlayer(message, opponent);
      
      const messageBox = ViewHelper.generateMessageBox(message);
      container.append(messageBox);
      return this.messageDisplayCompleted(messageBox);
    });
  }

  
}
