"use strict";
import { timeoutPromise } from "~/_utils/utils";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { GameMessageBox } from "./game-message-box/game-message-box";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./game-message-view-helper.constants";
import { CLOSE_BTN } from "~/_constants/btn-icon.constants";

import { GameResults } from "./game-results/game-results";
import {Confetti} from "~/components/confetti/confetti";
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
    });
  }

  static hideContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container).then(container => {
      ElementHandler.hide(container);
      ElementHandler.clearContent(container);
      return;
    });
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

  static displayGameOverMessage(message, gameResults) {
    return new Promise((resolve, reject) => {
      GameMessageViewHelper.displayMessage(message).then(messageBox => {
        console.log("throw confetti", "load results module");
        // throw confetti
        const confetti = new Confetti();
        confetti.generateView();
        
        const closeBnt = ElementGenerator.generateButton(CLOSE_BTN, () => {
          GameMessageViewHelper.removeMessageBoxAndClose().then(() => resolve()).catch(() => reject());
          console.log("remove confetti");
        });

        messageBox.append(closeBnt);
        messageBox.append(GameResults.generateView(gameResults));
       
      }).catch(() => reject());
    });

  }

}
