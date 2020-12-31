"use strict";
import { GameMessageController } from "../game-message-controller";
import { MESSAGES } from "./game-message-parallel-controller.constants";

export class GameMessageParallelController extends GameMessageController {

  constructor() {
    super();
    this.gameMessages = MESSAGES;
  }

  displayStartMessage(player, opponent) {
    const message = this.startMessage(player, opponent);
    return this.displayWaitingMessage(message);
  }

  displayEndMessage(player, opponent, clearedMinefield) {
    const message = this.endMessage(player, opponent, clearedMinefield);
    return this.displayWaitingMessage(message);
  }

  startMessage(player, opponent) {
    return this.getMessageForPlayer(this.gameMessages.gameOn, player, opponent);
  }

  endMessage(player, opponent, clearedMinefield) {
    const messageType = player.lostGame ? this.gameMessages.gameOverLoss : this.gameMessages.gameOverWin;
    const message = clearedMinefield ? messageType.clearedMinefield : messageType.detonatedMine;
    return this.getMessageForPlayer(message, player, opponent);
  }

  getMessageForPlayer(message, player, opponent) {
    message = super.getMessageForPlayer(message, player);
    message = this.setMessageSubcontentForPlayer(message, opponent);
    return message;
  }

}
