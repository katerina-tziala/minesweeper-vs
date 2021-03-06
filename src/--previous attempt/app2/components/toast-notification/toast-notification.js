"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { CLOSE_BTN } from "~/_constants/btn-icon.constants";
import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
} from "./toast-notification.constants";
import { clone } from "~/_utils/utils";

export class ToastNotifications {
  #notificationTimeout;
  #duration;

  constructor(duration = 4000) {
    this.duration = duration;
    this.notificationTimeout = 0;
  }

  set notificationTimeout(notificationTimeout) {
    this.#notificationTimeout = notificationTimeout;
  }

  get notificationTimeout() {
    return this.#notificationTimeout;
  }

  set duration(duration) {
    this.#duration = duration;
  }

  get duration() {
    return this.#duration;
  }

  get notificationContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container);
  }

  get closeBtnParams() {
    const btnParams = clone(CLOSE_BTN);
    btnParams.className += ` ${DOM_ELEMENT_CLASS.toastCloseBtn}`;
    return btnParams;
  }

  getStyleClass(notification) {
    return (
      DOM_ELEMENT_CLASS.toastNotification +
      TYPOGRAPHY.doubleHyphen +
      notification.type
    );
  }

  getNotificationTemplate(notification) {
    return `
            <div class=${DOM_ELEMENT_CLASS.title}>
                <div class=${DOM_ELEMENT_CLASS.titleIcon}></div>
                <div>${notification.title}</div>
            </div>
            ${notification.content.join("</br>")}
        `;
  }

  show(notification, duration = this.duration) {
    this.notificationContainer
      .then((container) => {
        this.hide(container);
        return container;
      })
      .then((container) => {
        this.renderNotification(container, notification);
        return container;
      })
      .then((container) => {
        this.display(container);
        return;
      })
      .then(() => {
        this.setNotificationTimeout(duration);
      });
  }

  setNotificationTimeout(duration) {
    this.notificationTimeout = setTimeout(() => {
      this.notificationContainer.then((container) => {
        this.hide(container);
        this.clear();
      });
    }, duration);
  }

  hide(container) {
    ElementHandler.removeStyleClass(container, DOM_ELEMENT_CLASS.show);
    AriaHandler.removeRole(container);
    AriaHandler.removeAriaLive(container);
    this.clear();
  }

  display(container) {
    ElementHandler.addStyleClass(container, DOM_ELEMENT_CLASS.show);
    AriaHandler.setAlertRole(container);
    AriaHandler.setAriaAssertive(container);
  }

  clearContent(notification) {
    notification.className = DOM_ELEMENT_CLASS.toastNotification;
    ElementHandler.clearContent(notification);
  }

  renderNotification(container, notification) {
    this.clearContent(container);
    ElementHandler.addStyleClass(container, this.getStyleClass(notification));
    container.innerHTML = this.getNotificationTemplate(notification);
    const closeBtn = ElementGenerator.generateButton(
      this.closeBtnParams,
      this.closeNotification.bind(this),
    );
    container.append(closeBtn);
  }

  closeNotification() {
    this.notificationContainer.then((container) => this.hide(container));
  }

  clear() {
    if (this.notificationTimeout > 0) {
      clearTimeout(this.notificationTimeout);
      this.notificationTimeout = 0;
    }
  }
}
