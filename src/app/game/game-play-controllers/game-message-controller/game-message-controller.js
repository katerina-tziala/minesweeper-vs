"use strict";
import { clone, replaceStringParameter, timeoutPromise } from "~/_utils/utils";
import { MESSAGES } from "./game-message-controller.constants";
import { GameMessageViewHelper as ViewHelper } from "./game-message-view-helper/game-message-view-helper";

export class GameMessageController {

  constructor() {
    this.gameMessages = MESSAGES;
  }

  generateView() {
    return ViewHelper.generateContainer();
  }

  hide() {
    return ViewHelper.hideContainer();
  }

  close() {
    return ViewHelper.removeMessageBoxAndClose();
  }

  displayWaitingMessage(message) {
    return ViewHelper.displayWaitingMessage(message);
  }

  displayFreezingMessage(message) {
    return ViewHelper.displayMessage(message);
  }
  
  displayStartMessage(player) {
    const message = this.startMessage(player);
    return this.displayWaitingMessage(message);
  }

  displayGameOverMessage(gameResults) {
    const message = this.endMessage(gameResults.playersResults[0]);
    return this.showGameOverMessage(message, gameResults);
  }

  showGameOverMessage(message, gameResults) {
    return ViewHelper.displayGameOverMessage(message, gameResults);
  }

  displayReadyMessage(player) {
    const message = this.readyMessage(player);
    if (message) {
      return this.displayWaitingMessage(message);
    }
    return Promise.resolve();
  }

  readyMessage(player) {
    if (this.gameMessages.gameReady) {
      return this.getMessageForPlayer(this.gameMessages.gameReady, player);
    }
    return undefined;
  }

  startMessage(player) {
    return this.getMessageForPlayer(this.gameMessages.gameOn, player);
  }

  endMessage(player) {
    const message = player.lostGame ? this.gameMessages.gameOverLoss : this.gameMessages.gameOverWin;
    return this.getMessageForPlayer(message, player);
  }

  getMessageForPlayer(message, player) {
    message = clone(message);
    return this.setMessageContentForPlayer(message, player);
  }

  setMessageContentForPlayer(message, player) {
    if (message.content) {
      message.content = replaceStringParameter(
        message.content,
        player.name,
      );
    }
    return message;
  }

  setMessageSubcontentForPlayer(message, player) {
    message.subcontent = replaceStringParameter(
      message.subcontent,
      player.name,
    );
    return message;
  }

  setMessageTitleForPlayer(message, player) {
    message.title = replaceStringParameter(
      message.title,
      player.name,
    );
    return message;
  }

}
