"use strict";

import "../../../styles/pages/_login.scss";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";

import { Page } from "../page";
import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  FORM_PARAMS,
} from "./join-page.constants";

import { FormUsername } from "~/components/form/form-username/form-username";



import { IconLoader } from "~/components/icon-loader/icon-loader";



import { NOTIFICATION_MESSAGE } from "~/components/toast-notification/toast-notification.constants";

export class JoinPage extends Page {
  #loginForm;

  constructor() {
    super();
    const username = LocalStorageHelper.retrieve("username");
    if (username) {
      self.onlineConnection.establishConnection({ username });
    }
    this.#loginForm = new FormUsername(
      this.login.bind(this),
      username ? username : TYPOGRAPHY.emptyString,
    );
    this.init();
  }

  get loginContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.loginContainer);
  }

  renderPage(mainContainer) {
    mainContainer.append(this.renderLoginForm());
    this.hideLoader();
  }

  renderLoginForm() {
    const container = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.loginContainer],
      DOM_ELEMENT_ID.loginContainer,
    );
    container.append(this.#loginForm.renderForm(FORM_PARAMS));
    return container;
  }

  login(formValues) {
    if (self.onlineConnection) {
      this.#displayLoader().then(() => {
        self.onlineConnection.establishConnection(formValues);
      });
    } else {
      self.toastNotifications.show(NOTIFICATION_MESSAGE.connectionErrorRefresh);
    }
  }

  #displayLoader() {
    return this.loginContainer.then((container) => {
      container.append(IconLoader.generate());
      return;
    });
  }

  #hideLoader() {
    return this.loginContainer.then((container) => IconLoader.remove(container));
  }

  onConnectionError(errorMessage) {
    super.onConnectionError(errorMessage);
    this.#hideLoader();
  }
}
