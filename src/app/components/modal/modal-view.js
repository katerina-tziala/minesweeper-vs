"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { CANCEL_BTN } from "~/_constants/btn-text.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONFIRMATION } from "./modal.constants";
import { preventInteraction } from "~/_utils/utils";

export class ModalView {

  static get modalWindow() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.window);
  }

  static get displayedModalWindow() {
    return ModalView.modalWindow.then(modalWindow => {
      ElementHandler.addStyleClass(modalWindow, DOM_ELEMENT_CLASS.display);
      return modalWindow;
    });
  }

  static get hiddenModalWindow() {
    return ModalView.modalWindow.then(modalWindow => {
      ElementHandler.removeStyleClass(modalWindow, DOM_ELEMENT_CLASS.display);
      return modalWindow;
    });
  }

  static timeoutPromise(milliSeconds, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), milliSeconds));
  }

  static get modalDialog() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.modalDialog);
  }

  static get clearedModalDialog() {
    return ModalView.modalDialog.then(modalDialog => {
      ElementHandler.clearContent(modalDialog);
      AriaHandler.removeAriaModal(modalDialog);
      return modalDialog;
    });
  }

  static get newModalDialog() {
    return ModalView.clearedModalDialog.then(modalDialog => {
      AriaHandler.setAriaModal(modalDialog, DOM_ELEMENT_ID.modalDialogTitle);
      return modalDialog;
    });
  }

  static get modalTimer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.modalTimer);
  }

  static generateTitle(title) {
    const titleContainer = document.createElement("h2")
    ElementHandler.addStyleClass(titleContainer, DOM_ELEMENT_CLASS.title);
    ElementHandler.setID(titleContainer, DOM_ELEMENT_ID.modalDialogTitle);
    titleContainer.innerHTML = title;
    return titleContainer;
  }

  static generateContent(content, timer) {
    const contentContainer = document.createElement("p")
    ElementHandler.addStyleClass(contentContainer, DOM_ELEMENT_CLASS.content);
    if (timer) {
      content += `<span id="${DOM_ELEMENT_ID.modalTimer}">${timer}</span>`;
    }
    contentContainer.innerHTML = content;
    return contentContainer;
  }

  static generateDialogContent(message) {
    const boxContentContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.dialogContent]);
    const title = ModalView.generateTitle(message.title);
    const content = ModalView.generateContent(message.content, message.timer);
    boxContentContainer.append(title, content);
    return boxContentContainer;
  }

  static updateConfirmationTimer(timerValue) {
    return ModalView.modalTimer
      .then(modalTimer => {
        timerValue--;
        modalTimer.innerHTML = timerValue;
        return timerValue;
      }).catch(() => {
        return 0;
      });
  }

  static clearShakingStyle(modalDialog) {
    if (modalDialog) {
      ElementHandler.removeStyleClass(modalDialog, DOM_ELEMENT_CLASS.shakeDialog);
    }
  }

  static generateConfirmationDialog(message, onCancel, onConfirm) {
    return ModalView.newModalDialog.then(modalBox => {
      const confirmationContainer = ModalView.generateDialogContent(message);
      const actions = ModalView.generateConfirmationActions(message.confirmButton, onCancel, onConfirm);
      confirmationContainer.append(actions);
      modalBox.append(confirmationContainer);
      return;
    });
  }

  static generateConfirmationActions(confirmBtnParams, onCancel, onConfirm) {
    const actions = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.actions]);
    const cancelButton = ElementGenerator.generateButton(CANCEL_BTN, onCancel);
    const confirmButton = ElementGenerator.generateButton(confirmBtnParams, onConfirm);
    actions.append(cancelButton, confirmButton);
    return actions;
  }

  static setConfirmationNavigation() {
    ModalView.modalDialog.then(modalDialog => {
      const buttons = Array.prototype.slice.call(modalDialog.getElementsByTagName("BUTTON"));
      if (buttons.length) {
        buttons[0].focus();
        buttons.forEach((button, index) => {
          button.addEventListener("keydown", (event) => ModalView.navigateInConfirmationModal(event, buttons, index));
        });
      }
    });
  }

  static navigateInConfirmationModal(event, buttons, index) {
    const eventCode = event.keyCode || event.which;
    if (eventCode !== 13) { // not enter
      preventInteraction(event);
      if (eventCode === 9) {  // Tab
        buttons[index].blur();
        let nextIndex = (event.shiftKey) ? index - 1 : index + 1;
        nextIndex = (nextIndex < 0) ? buttons.length - 1 : (nextIndex < buttons.length) ? nextIndex : 0;
        buttons[nextIndex].focus();
      }
    }
  }

}
