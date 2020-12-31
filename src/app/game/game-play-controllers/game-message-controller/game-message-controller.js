"use strict";
import { clone, replaceStringParameter } from "~/_utils/utils";
import { MESSAGES } from "./game-message-controller.constants";
import { GameMessageViewHelper as ViewHelper } from "./game-message-view-helper/game-message-view-helper";
export class GameMessageController {
  #timeOut;

  constructor() {
    this.messageDuration = 4000;
    this.gameMessages = MESSAGES;
  }

  #messageDisplayCompleted(messageBox) {
    return this.#messageDurationCompleted().then(() => {
      return this.onMessageBoxHidden(messageBox);
    });
  }

  onMessageBoxHidden(messageBox) {
    return ViewHelper.onMessageBoxRemoved(messageBox).then(() => {
      return this.hide();
    });
  }

  #messageDurationCompleted() {
    return new Promise(resolve => {
      this.#timeOut = setTimeout(() => {
        resolve();
      }, this.messageDuration);
    });
  }

  get onViewInit() {
    this.#clear();
    return ViewHelper.clearedContainer();
  }

  #clear() {
    if (this.#timeOut) {
      clearTimeout(this.#timeOut);
      this.#timeOut = 0;
    }
  }

  generateView() {
    return ViewHelper.generateContainer();
  }

  hide() {
    this.#clear();
    return ViewHelper.hideContainer();
  }

  displayStartMessage(player) {
    const message = this.startMessage(player);
    return this.displayWaitingMessage(message);
  }

  displayEndMessage(player) {
    const message = this.endMessage(player);
    return this.displayWaitingMessage(message);
  }

  displayWaitingMessage(message) {
    return this.onViewInit.then(container => {
      const messageBox = ViewHelper.generateMessageBox(message);
      container.append(messageBox);
      ViewHelper.displayContainer(container);
      return this.#messageDisplayCompleted(messageBox);
    });
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
