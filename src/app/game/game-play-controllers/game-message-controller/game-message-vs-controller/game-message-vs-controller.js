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

  getMessageForPlayer(message, player) {
    message = super.getMessageForPlayer(message, player);
    if (this.vsMode) {
      message.subtitle = replaceStringParameter(
        message.subtitle,
        GAME_GOAL[this.vsMode],
      );
    }
    return message;
  }

 
  // #generateMessageBox(message) {
  //   const messageBox = ViewHelper.generateMessageBox(message);
  //   messageBox.append(ViewHelper.generateSubcontent(message.subcontent));
  //   return messageBox;
  // }

  // displayEndMessage(player, opponent, clearedMinefield) {
  //   return this.display().then(container => {
  //     const message = this.endMessage(player, opponent, clearedMinefield);
  //     const messageBox = this.#generateMessageBox(message);
  //     container.append(messageBox);
  //     return this.messageDisplayCompleted(messageBox);
  //   });
  // }

  // endMessage(player, opponent, clearedMinefield) {
  //   const messageType = player.lostGame ? MESSAGES.gameOverLoss : MESSAGES.gameOverWin;
  //   const message = clearedMinefield ? messageType.clearedMinefield : messageType.detonatedMine;
  //   return this.getMessageForPlayer(message, player, opponent);
  // }
}
