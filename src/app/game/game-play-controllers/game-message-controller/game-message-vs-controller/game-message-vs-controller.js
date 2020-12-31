"use strict";
import { replaceStringParameter } from "~/_utils/utils";
import { GameMessageController } from "../game-message-controller";
import { MESSAGES, GAME_GOAL } from "./game-message-vs-controller.constants";

export class GameMessageVSController extends GameMessageController {

  constructor(vsMode) {
    super();
    this.vsMode = vsMode;
    this.gameMessages = MESSAGES;
  }

  displayDrawMessage(player, opponent) {
    let message = this.getMessageForPlayer(this.gameMessages.gameOverDraw, player);
    message = this.setMessageContentForPlayer(message, opponent);
    return this.displayWaitingMessage(message);
  }

  displayEndMessage(player, opponent, gameOverType) {
    const message = this.endMessage(player, opponent, gameOverType);
    return this.displayWaitingMessage(message);
  }

  endMessage(player, opponent, gameOverType) {
    const messageType = player.lostGame ? this.gameMessages.gameOverLoss : this.gameMessages.gameOverWin;
    const message = this.getMessageForPlayer(messageType[gameOverType], player);
    return this.setMessageSubcontentForPlayer(message, opponent);
  }

  getMessageForPlayer(message, player) {
    message = super.getMessageForPlayer(message, player);
    if (this.vsMode) {
      message = this.getMessageWithUpdatedSubtitle(message);
    }
    return message;
  }

  getMessageWithUpdatedSubtitle(message) {
    message.subtitle = replaceStringParameter(
      message.subtitle,
      GAME_GOAL[this.vsMode],
    );
    return message;
  }

}
