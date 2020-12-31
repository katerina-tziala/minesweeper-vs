"use strict";
import { replaceStringParameter } from "~/_utils/utils";
import { GameMessageViewHelper as ViewHelper } from "../game-message-view-helper/game-message-view-helper";
import { GameMessageController } from "../game-message-controller";
import { MESSAGES } from "./game-message-parallel-controller.constants";

export class GameMessageParallelController extends GameMessageController {

  constructor() {
    super();
    this.messageDuration = 4000;
    this.gameMessages = MESSAGES;
  }

  displayStartMessage(player, opponent) {
    return this.display().then(container => {
      const message = this.startMessage(player, opponent);
      const messageBox = this.#generateMessageBox(message);
      container.append(messageBox);
      return this.messageDisplayCompleted(messageBox);
    });
  }

  startMessage(player, opponent) {
    return this.getMessageForPlayer(this.gameMessages.gameOn, player, opponent);
  }

  getMessageForPlayer(message, player, opponent) {
    message = super.getMessageForPlayer(message, player);
    message.subcontent = replaceStringParameter(
      message.subcontent,
      opponent.name,
    );
    return message;
  }

  #generateMessageBox(message) {
    const messageBox = ViewHelper.generateMessageBox(message);
    messageBox.append(ViewHelper.generateSubcontent(message.subcontent));
    return messageBox;
  }

  displayEndMessage(player, opponent, clearedMinefield) {
    return this.display().then(container => {
      const message = this.endMessage(player, opponent, clearedMinefield);
      const messageBox = this.#generateMessageBox(message);
      container.append(messageBox);
      return this.messageDisplayCompleted(messageBox);
    });
  }

  endMessage(player, opponent, clearedMinefield) {
    const messageType = player.lostGame ? this.gameMessages.gameOverLoss : this.gameMessages.gameOverWin;
    const message = clearedMinefield ? messageType.clearedMinefield : messageType.detonatedMine;
    return this.getMessageForPlayer(message, player, opponent);
  }
}
