"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { CANCEL_BTN } from "~/_constants/btn-text.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONFIRMATION } from "./modal.constants";
import { clone } from "~/_utils/utils";

export class Modal {
  #shakeTimeout;
  #confirmationTimer = 0;
  #confirmationCountdown;



  constructor() {
    console.log("hey modal");
  }

  get #modalWindow() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.window);
  }

  get #modalBox() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.modalBox);
  }

  get #modalTimer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.modalTimer);
  }

  get #clearedModalBox() {
    return this.#modalBox.then(modalBox => {
      ElementHandler.clearContent(modalBox);
      return modalBox;
    });
  }

  #generateTitle(title) {
    const titleContainer = document.createElement("h2")
    ElementHandler.addStyleClass(titleContainer, DOM_ELEMENT_CLASS.title);
    titleContainer.innerHTML = title;
    return titleContainer;
  }

  #generateContent(content, timer) {
    const contentContainer = document.createElement("p")
    ElementHandler.addStyleClass(contentContainer, DOM_ELEMENT_CLASS.content);
    if (timer) {
      content += `<span id="${DOM_ELEMENT_ID.modalTimer}">${timer}</span>`;
    }
    contentContainer.innerHTML = content;
    return contentContainer;
  }



  // SHAKE MESSAGE BOX
  #addShakeEvent() {
    this.#modalWindow.then(modalWindow => modalWindow.addEventListener("click", this.#shakeMessageBox.bind(this), false));
  }

  #removeShakeEvent() {
    this.#modalWindow.then(modalWindow => {
      modalWindow.removeEventListener("click", this.#shakeMessageBox.bind(this), false);
      this.#stopShaking();
    });
  }

  #shakeMessageBox(event) {
    if (ElementHandler.getID(event.target) === DOM_ELEMENT_ID.window && !this.#shakeTimeout) {
      this.#modalBox.then(modalBox => {
        this.#stopShaking(modalBox);
        ElementHandler.addStyleClass(modalBox, DOM_ELEMENT_CLASS.shakeBox);
        this.#shakeTimeout = setTimeout(() => this.#stopShaking(modalBox), 500);
      });
    }
  }

  #stopShaking(modalBox) {
    this.#shakeTimeout = undefined;
    if (modalBox) {
      ElementHandler.removeStyleClass(modalBox, DOM_ELEMENT_CLASS.shakeBox);
    }
  }

  #display(shake = true) {
    //aria
    this.#modalWindow.then(modalWindow => {
      ElementHandler.addStyleClass(modalWindow, DOM_ELEMENT_CLASS.display);
      if (shake) {
        this.#addShakeEvent();
      }
    });
  }

  #hide() {
    //aria
    this.#modalWindow.then(modalWindow => {
      ElementHandler.removeStyleClass(modalWindow, DOM_ELEMENT_CLASS.display);
      return true;
    }).then(() => {
      this.#removeShakeEvent();
    });
  }




  #generateBoxContent(message) {
    const boxContentContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.boxContent]);
    const title = this.#generateTitle(message.title);
    const content = this.#generateContent(message.content, message.timer);
    boxContentContainer.append(title, content);
    return boxContentContainer;
  }

  #generateConfirmationActions(confirmBtnParams, onCancel, onConfirm) {
    const actions = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.actions]);
    const cancelButton = ElementGenerator.generateButton(CANCEL_BTN, onCancel);
    const confirmButton = ElementGenerator.generateButton(confirmBtnParams, onConfirm);
    actions.append(cancelButton, confirmButton);
    return actions;
  }

  #generateConfirmationContent(message, onCancel, onConfirm) {
    const confirmationContainer = this.#generateBoxContent(message);
    const actions = this.#generateConfirmationActions(message.confirmButton, onCancel, onConfirm);
    confirmationContainer.append(actions);
    return confirmationContainer;
  }

  displayConfirmation(message = CONFIRMATION.quitGame) {
    //aria
    this.#clearedModalBox.then(modalBox => {
      const confirmationMessage = this.#generateConfirmationContent(message,
        () => {
          console.log("cancelButton");
          this.#clearActionCountdown();
        },
        () => {
          console.log("confirmButton");
          this.#clearActionCountdown();
        });
      modalBox.append(confirmationMessage);


      this.#display();

      if (message.timer) {
        this.#confirmationTimer = message.timer;
        this.#setConfirmationCountdown().then(() => {
          console.log("confirmation over");
        });
      }

    });
  }








  // CONFIRMATION COUNT DOWN
  get #confirmationCountdownOver() {
    return this.#confirmationTimer == 0;
  }

  #clearActionCountdown() {
    clearInterval(this.#confirmationCountdown);
    this.#confirmationCountdown = undefined;
    this.#confirmationTimer = 0;
  }

  #setConfirmationCountdown() {
    return new Promise((resolve) => {
      this.#confirmationCountdown = setInterval(() => {
        this.#updateConfirmationTimer().then(() => {
          if (this.#confirmationCountdownOver) {
            this.#clearActionCountdown();
            resolve();
          }
        });
      }, 1000);
    });
  }

  #updateConfirmationTimer() {
    return this.#modalTimer.then(modalTimer => {
      this.#confirmationTimer--;
      modalTimer.innerHTML = this.#confirmationTimer;
      return;
    }).catch(() => {
      this.#confirmationTimer = 0;
      return;
    });
  }

}
