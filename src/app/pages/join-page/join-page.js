"use strict";
import "../../../styles/pages/_login.scss";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { Page } from "../page";
import { User } from "~/_models/user";
import { FormUsername } from "~/components/form/form-username/form-username";
import { IconLoader } from "~/components/loaders/icon-loader/icon-loader";
import { CONFIRMATION } from "~/components/modal/modal.constants";
import { NOTIFICATION_MESSAGE } from "~/components/toast-notification/toast-notification.constants";

import { HeaderActionsController } from "../../controllers/header-actions-controller/header-actions-controller";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  FORM_PARAMS,
} from "./join-page.constants";
export class JoinPage extends Page {
  #loginForm;

  constructor(onPageChange) {
    super();




    this.actionControlller = new HeaderActionsController();
    this.actionControlller.init();


    this.onPageChange = onPageChange;
    
    const username = LocalStorageHelper.retrieve("username");

    if (self.onlineConnection) {
      self.onlineConnection.onUserUpdate = this.#onUserUpdate.bind(this);
      self.onlineConnection.onError = this.#onConnectionError.bind(this);
      if (username) {
        self.onlineConnection.establishConnection({ username });
      }
    }
    this.#loginForm = new FormUsername(this.login.bind(this),  username);

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
    if (!self.onlineConnection) {
      self.toastNotifications.show(NOTIFICATION_MESSAGE.connectionErrorRefresh);
      return;
    }
    this.#displayLoader().then(() => {
      self.onlineConnection.establishConnection(formValues);
    });
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

  #onConnectionError(errorType) {
    this.#hideLoader();
    if (errorType && self.modal) {
      // self.modal.displayConfirmation(CONFIRMATION.offline, (confirmed) => {
      //   if (confirmed) {
      //     const username = this.#loginForm.formValues.username;
      //     self.user = new User(username, username);
      //     this.#saveUsernameLocallyAndNavigate();
      //   }
      // });
    }
  }

  #onUserUpdate() {
    if (self.user.conected) {
      this.#saveUsernameLocallyAndNavigate();
    }
  }

  #saveUsernameLocallyAndNavigate() {
    LocalStorageHelper.save("username", self.user.username);
    this.onPageChange();
  }

}
