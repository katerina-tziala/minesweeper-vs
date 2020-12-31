"use strict";
import { clone, replaceStringParameter } from "~/_utils/utils";
import { MESSAGES } from "./game-message-controller.constants";
import { GameMessageViewHelper as ViewHelper } from "./game-message-view-helper/game-message-view-helper";
export class GameMessageController {
  #timeOut;

  constructor() {
    this.messageDuration = 3500;
    this.gameMessages = MESSAGES;
  }

  generateView() {
    return ViewHelper.generateContainer();
  }

  hide() {
    this.clear();
    return ViewHelper.hideContainer();
  }

  displayStartMessage(player) {
    return this.display().then(container => {
      const message = this.startMessage(player);
      const messageBox = ViewHelper.generateMessageBox(message);
      container.append(messageBox);
      return this.messageDisplayCompleted(messageBox);
    });
  }

  displayEndMessage(player) {
    return this.display().then(container => {
      const message = this.endMessage(player);
      const messageBox = ViewHelper.generateMessageBox(message);
      container.append(messageBox);
      return this.messageDisplayCompleted(messageBox);
    });
  }

  startMessage(player) {
    return this.getMessageForPlayer(this.gameMessages.gameOn, player);
  }

  getMessageForPlayer(message, player) {
    message = clone(message);
    return this.setMessageContentForPlayer(message, player);
  }

  setMessageContentForPlayer(message, player) {
    message.content = replaceStringParameter(
      message.content,
      player.name,
    );
    return message;
  }

  endMessage(player) {
    const message = player.lostGame ? this.gameMessages.gameOverLoss : this.gameMessages.gameOverWin;
    return this.getMessageForPlayer(message, player);
  }

  messageDisplayCompleted(messageBox) {
    return this.messageDurationCompleted().then(() => {
      return ViewHelper.onMessageBoxRemoved(messageBox);
    }).then(() => {
      return this.hide();
    });
  }

  messageDurationCompleted() {
    return new Promise(resolve => {
      this.#timeOut = setTimeout(() => {
        resolve();
      }, this.messageDuration);
    });
  }

  display() {
    this.clear();
    return ViewHelper.displayedContainer();
  }

  clear() {
    if (this.#timeOut) {
      clearTimeout(this.#timeOut);
      this.#timeOut = 0;
    }
  }

}
