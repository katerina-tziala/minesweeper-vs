"use strict";

import { ElementHandler } from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  MOVEMENT_DURATION,
} from "./modal.constants";

import { ModalView } from "./modal-view";
export class Modal {
  #shakeTimeout = false;
  #confirmationTimer = 0;
  #confirmationCountdown;
  #displayed = false;

  constructor() {}

  // SHAKE DIALOG
  #addShakeEvent() {
    this.shakeDialog = this.#shakeDialog.bind(this);
    ModalView.modalWindow.then((modalWindow) =>
      modalWindow.addEventListener("click", this.shakeDialog, true),
    );
  }

  #removeShakeEvent() {
    ModalView.modalWindow.then((modalWindow) => {
      this.#stopShaking();
      modalWindow.removeEventListener("click", this.shakeDialog, true);
    });
  }

  #shakeDialog(event) {
    if (
      !this.#shakeTimeout &&
      ElementHandler.getID(event.target) === DOM_ELEMENT_ID.window
    ) {
      ModalView.modalDialog
        .then((modalDialog) => {
          this.#stopShaking(modalDialog);
          this.#shakeTimeout = true;
          ElementHandler.addStyleClass(
            modalDialog,
            DOM_ELEMENT_CLASS.shakeDialog,
          );
          return ModalView.timeoutPromise(MOVEMENT_DURATION.shake, modalDialog);
        })
        .then((modalDialog) => {
          this.#stopShaking(modalDialog);
        });
    }
  }

  #stopShaking(modalDialog) {
    this.#shakeTimeout = false;
    ModalView.clearShakingStyle(modalDialog);
  }

  // ESCAPE EVENTS
  #removeEscapeEvent() {
    document.removeEventListener("keyup", this.onModalEscape, true);
  }

  #onEscape(event, callBack) {
    const eventCode = event.keyCode || event.which;
    if (eventCode === 27) {
      callBack();
    }
  }

  // DISPLAY HIDE MODAL
  #display(shake = true) {
    return ModalView.displayedModalWindow
      .then(() => {
        return ModalView.timeoutPromise(MOVEMENT_DURATION.slideIn);
      })
      .then(() => {
        if (shake) {
          this.#addShakeEvent();
        }
        this.#displayed = true;
        return;
      });
  }

  #hide() {
    this.#clearActionCountdown();
    this.#removeEscapeEvent();
    if (this.#displayed) {
      return ModalView.hiddenModalWindow
        .then(() => {
          return ModalView.timeoutPromise(MOVEMENT_DURATION.slideIn);
        })
        .then(() => {
          this.#displayed = false;
          this.#removeShakeEvent();
          return ModalView.clearedModalDialog;
        });
    }
    return Promise.resolve();
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

  #setConfirmationCountdown(onCompletion) {
    this.#confirmationCountdown = setInterval(() => {
      ModalView.updateConfirmationTimer(this.#confirmationTimer).then(
        (timerValue) => {
          this.#confirmationTimer = timerValue;
          if (this.#confirmationCountdownOver) {
            this.#clearActionCountdown();
            onCompletion();
          }
        },
      );
    }, 1000);
  }

  #onConfirmationAction(submit, value) {
    this.#clearActionCountdown();
    this.#removeEscapeEvent();
    this.#hide().then(() => {
      submit(value);
    });
  }

  #setMessageTimer(timerSeconds, onAction) {
    if (timerSeconds && onAction) {
      this.#confirmationTimer = timerSeconds;
      this.#setConfirmationCountdown(() =>
        this.#onConfirmationAction(onAction, true),
      );
    }
  }

  #setModalEscape(onAction) {
    this.onModalEscape = (event) => {
      this.#onEscape(event, () => this.#onConfirmationAction(onAction, true));
    };
    document.addEventListener("keyup", this.onModalEscape, true);
  }


  displayConfirmation(message, onAction) {
    this.#hide()
      .then(() => {
        return ModalView.generateConfirmationDialog(
          message,
          () => this.#onConfirmationAction(onAction, false),
          () => this.#onConfirmationAction(onAction, true),
        );
      })
      .then(() => {
        return this.#display();
      })
      .then(() => {
        ModalView.setConfirmationNavigation();
        // timer
        this.#setMessageTimer(message.timer, onAction);
        // escape modal dialog
        this.#setModalEscape(onAction);
      });
  }

}
