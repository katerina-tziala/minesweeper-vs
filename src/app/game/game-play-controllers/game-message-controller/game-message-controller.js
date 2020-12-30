"use strict";

import { clone, replaceStringParameter } from "~/_utils/utils";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, MESSAGES } from "./game-message-controller.constants";

import { GameMessageViewHelper as ViewHelper } from "./game-message-view-helper";
export class GameMessageController {
  #timeOut;
  constructor(type) {
    this.messages = MESSAGES[type];
    //console.log("GameMessageController");
    console.log(this.messages);

  }

  generateView() {
    return ViewHelper.generateContainer();
  }

  hide() {
    this.#clear();
    return ViewHelper.hideContainer();
  }

  displayStartMessage(player) {
    return this.#display().then(container => {
      const message = this.#startMessage(player);
      const messageBox = ViewHelper.generateMessageBox(message);
      container.append(messageBox);
      return this.#messageDisplayCompleted(messageBox);
    });
  }

  displayEndMessage(player) {
    return this.#display().then(container => {
      const message = this.#endMessage(player);
      const messageBox = ViewHelper.generateMessageBox(message);
      container.append(messageBox);
      return this.#messageDisplayCompleted(messageBox);
    });
  }

  #startMessage(player) {
    return this.#getMessageForPlayer(this.messages.gameOn, player);
  }

  #getMessageForPlayer(message, player) {
    message = Object.assign(message);
    message.content = replaceStringParameter(
      message.content,
      player.name,
    );
    return message;
  }

  #endMessage(player) {
    const message = player.lostGame ? this.messages.gameOverLoss : this.messages.gameOverWin;
    return this.#getMessageForPlayer(message, player);
  }

  #messageDisplayCompleted(messageBox) {
    return this.#messageDurationCompleted().then(() => {
      return ViewHelper.onMessageBoxRemoved(messageBox);
    }).then(() => {
      return this.hide();
    });
  }

  #messageDurationCompleted() {
    return new Promise(resolve => {
      this.#timeOut = setTimeout(() => {
        resolve();
      }, 3500);
    });
  }

  #display() {
    this.#clear();
    return ViewHelper.displayedContainer();
  }

  #clear() {
    if (this.#timeOut) {
      clearTimeout(this.#timeOut);
      this.#timeOut = 0;
    }
  }

}
