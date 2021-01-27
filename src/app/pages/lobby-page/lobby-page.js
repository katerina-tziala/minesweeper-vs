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
} from "./lobby-page.constants";





// import { NOTIFICATION_MESSAGE } from "~/components/toast-notification/toast-notification.constants";

export class LobbyPage extends Page {

  constructor(navigateToHome) {
    super();
    this.navigateToHome = navigateToHome;
    self.settingsController.gameSettingsHidden = false;
    this.init();
    console.log("LobbyPage");
  }


  

  renderPage(mainContainer) {
    console.log("render lobby");
    // mainContainer.append(this.renderLoginForm());
    this.hideLoader();
  }

  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);
    console.log("onConnectionError");
  }
}
