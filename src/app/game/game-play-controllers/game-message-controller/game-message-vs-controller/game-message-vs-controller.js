"use strict";
import { PLAY_BTN } from "~/_constants/btn-text.constants";
import { replaceStringParameter } from "~/_utils/utils";
import { ElementGenerator } from "HTML_DOM_Manager";
import { GameMessageController } from "../game-message-controller";
import { MESSAGES, GAME_GOAL } from "./game-message-vs-controller.constants";
export class GameMessageVSController extends GameMessageController {

  constructor(vsMode) {
    super();
    this.vsMode = vsMode;
    this.gameMessages = MESSAGES;
  }

  displayGameOverMessage(player, opponent, gameResults) {
    const message = this.overMessage(player, opponent, gameResults.gameInfo);
    return this.showGameOverMessage(message, gameResults);
  }

  displayTurnMessage(player) {
    const message = this.turnMessage(player);
    return this.displayWaitingMessage(message);
  }

  displayManualTurnMessage(player) {
    const message = this.turnMessage(player, this.gameMessages.gameTurnManual);
    return new Promise((resolve, reject) => {
      this.displayFreezingMessage(message).then(messageBox => {
        const button = ElementGenerator.generateButton(PLAY_BTN, () => {
          this.close().then(() => resolve()).catch(() => reject());
        });
        messageBox.append(button);
      }).catch(() => reject());
    });
  }

  turnMessage(player, messageStructure = this.gameMessages.gameTurn) {
    const message = this.getMessageForPlayer(messageStructure, player);
    return this.setMessageTitleForPlayer(message, player);
  }

  overMessage(player, opponent, gameInfo) {
    if (gameInfo.draw) {
      return this.drawMessage(player, opponent);
    }
    return this.endMessage(player, opponent, gameInfo.gameOverType);
  }

  drawMessage(player, opponent) {
    const message = this.getMessageForPlayer(this.gameMessages.gameOverDraw, player);
    return this.setMessageContentForPlayer(message, opponent);
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
