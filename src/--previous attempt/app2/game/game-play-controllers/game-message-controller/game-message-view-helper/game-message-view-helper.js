"use strict";
import { timeoutPromise } from "~/_utils/utils";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { GameMessageBox } from "./game-message-box/game-message-box";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./game-message-view-helper.constants";
import { CLOSE_BTN } from "~/_constants/btn-icon.constants";

import { GameResults } from "./game-results/game-results";
import { Confetti } from "~/components/confetti/confetti";
export class GameMessageViewHelper {

  static generateContainer() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_CLASS.container);
    ElementHandler.hide(container);
    return container;
  }

  static clearedContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container).then(container => {
      ElementHandler.clearContent(container);
      ElementHandler.display(container);
      return container;
    }).catch(() => Promise.resolve());
  }

  static hideContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container).then(container => {
      ElementHandler.hide(container);
      ElementHandler.clearContent(container);
      return;
    }).catch(() => Promise.resolve());
  }

  static generateMessageBox(message) {
    return GameMessageBox.generateView(message);
  }

  static removeMessageBox() {
    return GameMessageBox.removeMessageBox();
  }

  static displayMessage(message) {
    return GameMessageViewHelper.clearedContainer().then(container => {
      const messageBox = GameMessageViewHelper.generateMessageBox(message);
      container.append(messageBox);
      return messageBox;
    });
  }

  static displayWaitingMessage(message) {
    const duration = message.duration ? message.duration : 0;
    return GameMessageViewHelper.displayMessage(message).then(() => {
      return timeoutPromise(duration);
    }).then(() => {
      return GameMessageViewHelper.removeMessageBoxAndClose();
    });
  }

  static removeMessageBoxAndClose() {
    return GameMessageViewHelper.removeMessageBox().then(() => {
      return GameMessageViewHelper.hideContainer();
    });
  }

  static confettiColors(gameResults) {
    if (gameResults.playersResults.length !== 2) {
      return [];
    }
    let playerColors = [];
    if (gameResults.gameInfo.draw) {
      playerColors = gameResults.playersResults.map(playerResults => playerResults.colorType);
    } else {
      const winner = gameResults.playersResults.find(playerResults => !playerResults.lostGame);
      playerColors = winner ? [winner.colorType] : [];
    }
    return playerColors;
  }

  static dropConfetti(gameResults) {
    let confetti;
    if (!(gameResults.playersResults.length === 1 && gameResults.playersResults[0].lostGame)) {
      confetti = new Confetti();
      confetti.drop(GameMessageViewHelper.confettiColors(gameResults));
    }
    return confetti;
  }

  static displayMessageAndResults(message, gameResults) {
    return GameMessageViewHelper.displayMessage(message).then(messageBox => {
      messageBox.append(GameResults.generateView(gameResults));
      return messageBox;
    });
  }

  static displayGameOverMessage(message, gameResults) {
    return new Promise((resolve, reject) => {
      GameMessageViewHelper.displayMessageAndResults(message, gameResults)
        .then(messageBox => {
          const confettiDrop = GameMessageViewHelper.dropConfetti(gameResults);
          const closeBnt = ElementGenerator.generateButton(CLOSE_BTN, () => {
            if (confettiDrop) {
              confettiDrop.clear();
            };
            GameMessageViewHelper.removeMessageBoxAndClose().then(() => resolve()).catch(() => reject());
          });
          messageBox.append(closeBnt);
        }).catch(() => reject());
    });
  }

}
