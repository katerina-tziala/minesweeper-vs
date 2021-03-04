"use strict";
import "../../../styles/pages/_login.scss";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { Page } from "../page";
import { User } from "~/_models/user";
import { FormUsername } from "~/components/form/form-username/form-username";
import { IconLoader } from "~/components/loaders/icon-loader/icon-loader";
import { CONFIRMATION } from "~/components/modal/modal.constants";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  FORM_PARAMS,
} from "./join-page.constants";

export class JoinPage extends Page {
  #loginForm;

  constructor(onPageChange) {
    super(onPageChange);
  }

  get gameSettingsAllowed() {
    return false;
  }

  get #loginContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.loginContainer);
  }

  init(username) {
    this.#loginForm = new FormUsername(this.#login.bind(this), username);
    super.init();
  }

  #renderLoginForm() {
    if (!this.#loginForm) {
      return document.createDocumentFragment();
    }
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.loginContainer], DOM_ELEMENT_ID.loginContainer);
    container.append(this.#loginForm.renderForm(FORM_PARAMS));
    return container;
  }

  #login(formValues) {
    this.#displayFormLoader().then(() => {
      self.onlineConnection.establishConnection(formValues.username);
    });
  }

  #displayFormLoader() {
    return this.#loginContainer.then((container) => {
      container.append(IconLoader.generate());
      return;
    });
  }

  #hideFormLoader() {
    return this.#loginContainer.then((container) => IconLoader.remove(container))
    .catch(() => Promise.resolve());
  }

  #checkForOfflineJoining() {
    self.modal.displayConfirmation(CONFIRMATION.offline, (confirmed) => {
      if (confirmed) {
        const username = this.#loginForm.formValues.username;
        self.user = new User(username, username);
        this.#saveUsernameLocallyAndNavigate();
      }
    });
  }

  #saveUsernameLocallyAndNavigate() {
    LocalStorageHelper.save("username", self.user.username);
    this.onPageChange();
  }

  renderPage(mainContainer) {
    mainContainer.append(this.#renderLoginForm());
    this.hideLoader();
  }

  onConnectionError(errorType) {
    this.#hideFormLoader();
    if (errorType && self.modal) {
      this.#checkForOfflineJoining();
    }
  }

  onUserUpdate() {
    if (self.onlineConnection.live) {
      this.#saveUsernameLocallyAndNavigate();
    }
  }

}
