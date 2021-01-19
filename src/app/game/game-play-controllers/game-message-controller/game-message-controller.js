"use strict";
import { clone, replaceStringParameter, timeoutPromise } from "~/_utils/utils";
import { MESSAGES } from "./game-message-controller.constants";
import { GameMessageViewHelper as ViewHelper } from "./game-message-view-helper/game-message-view-helper";

export class GameMessageController {

  constructor() {
    this.messageDuration = 3500;
    this.gameMessages = MESSAGES;
  }

  // get onViewInit() {
  //   return ViewHelper.clearedContainer();
  // }

  generateView() {
    return ViewHelper.generateContainer();
  }

  hide() {
    return ViewHelper.hideContainer();
  }

  displayWaitingMessage(message) {
    return ViewHelper.displayWaitingMessage(message, this.messageDuration);
  }

  displayStartMessage(player) {
    const message = this.startMessage(player);
    return this.displayWaitingMessage(message);
  }

  displayGameOverMessage(player, gameResults) {
    const message = this.endMessage(player);


    ViewHelper.displayGameOverMessage(message, gameResults);

    // ViewHelper.displayGameOverMessage(message, gameResults).then(messageBox => {
    //   console.log(messageBox);
    //   console.log(player, gameResults);
    //   console.log("add stats");
    // });
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

  // onMessageBoxHidden(messageBox) {
  //   return ViewHelper.onMessageBoxRemoved(messageBox).then(() => {
  //     return this.hide();
  //   });
  // }

  // displayReadyMessage(player) {
  //   const message = this.readyMessage(player);
  //   return this.displayWaitingMessage(message);
  // }

  // readyMessage(player) {
  //   return this.getMessageForPlayer(this.gameMessages.gameReady, player);
  // }

}
