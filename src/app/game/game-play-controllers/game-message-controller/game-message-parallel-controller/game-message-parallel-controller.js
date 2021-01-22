"use strict";
import { GameMessageController } from "../game-message-controller";
import { MESSAGES } from "./game-message-parallel-controller.constants";

export class GameMessageParallelController extends GameMessageController {

  constructor() {
    super();
    this.gameMessages = MESSAGES;
  }

  displayStartMessage(player, opponent) {
    const message = this.getMessageForPlayer(this.gameMessages.gameOn, player, opponent);
    return this.displayWaitingMessage(message);
  }

  displayGameOverMessage(gameResults) {
    const message = this.getGameOverMessage(gameResults);
    return this.showGameOverMessage(message, gameResults);
  }

  getGameOverMessage(gameResults) {
    const player = gameResults.playersResults[0];
    const opponent = gameResults.playersResults[1];
    const gameOverType = gameResults.gameInfo.gameOverType;
    const messageType = player.lostGame ? this.gameMessages.gameOverLoss : this.gameMessages.gameOverWin;
    return this.getMessageForPlayer(messageType[gameOverType], player, opponent);
  }

  getMessageForPlayer(message, player, opponent) {
    message = super.getMessageForPlayer(message, player);
    if (opponent) {
      message = this.setMessageSubcontentForPlayer(message, opponent);
    }
    return message;
  }

}
