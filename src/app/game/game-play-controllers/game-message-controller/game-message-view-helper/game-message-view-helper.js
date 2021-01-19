"use strict";
import { timeoutPromise } from "~/_utils/utils";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { GameMessageBox } from "./game-message-box/game-message-box";
import { GameResults } from "./game-results/game-results";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./game-message-view-helper.constants";
import { CLOSE_BTN } from "~/_constants/btn-icon.constants";

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

  static displayWaitingMessage(message, duration) {
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

    GameMessageViewHelper.displayMessage(message).then(messageBox => {
      // console.log(gameResults);
      // throw confetti
      const closeBnt = ElementGenerator.generateButton(CLOSE_BTN, () => {
        GameMessageViewHelper.removeMessageBoxAndClose();
      });
      messageBox.append(closeBnt);
      messageBox.append(GameResults.generateView(gameResults));
    });
  }






}
