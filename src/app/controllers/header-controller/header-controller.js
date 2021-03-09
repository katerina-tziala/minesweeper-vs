"use strict";
import { PageType } from "~/_enums/page-type.enum";
import { LoggoutButton } from "~/components/loggout-button/loggout-button";
import { SettingsController } from "~/controllers/settings-controller/settings-controller";
import { InvitationsController } from "~/controllers/invitations-controller/invitations-controller";
import { OnlineIndicatorController } from "~/controllers/online-indicator-controller/online-indicator-controller";
import { NavigationController } from "~/controllers/navigation-controller/navigation-controller";

export class HeaderController {
  #SettingsController;
  #InvitationsController;
  #OnlineIndicator;

  constructor(onLoggout, onHomeNavigation) {
    this.#SettingsController = new SettingsController();
    this.onLoggout = onLoggout;
    this.onHomeNavigation = onHomeNavigation;
  }

  #setHeaderForUser() {
    if (!this.#OnlineIndicator) {
      this.#OnlineIndicator = new OnlineIndicatorController();
    }
    if (!this.#InvitationsController) {
      this.#InvitationsController = new InvitationsController();
    }
    LoggoutButton.generate(this.onLoggout);
  }
  
  #resetHeader() {
    LoggoutButton.remove();
    if (this.#InvitationsController) {
      this.#InvitationsController.onDestroy();
      this.#InvitationsController = undefined;
    }
    if (this.#OnlineIndicator) {
      this.#OnlineIndicator.onDestroy();
      this.#OnlineIndicator = undefined;
    }
  }
  
  init() {
    !self.user ? this.#resetHeader() : this.#setHeaderForUser();
  }

  setGameSettingsDisplay(gameSettingsAllowed) {
    this.#SettingsController.setGameSettingsDisplay(gameSettingsAllowed);
  }

  setNavigation(options = []) {
    NavigationController.setNavigation(options);
  }

  setHomeNavigation() {
    NavigationController.setNavigation([{
      page: PageType.HomePage,
      action: this.onHomeNavigation
    }]);
  }

  onPeersUpdate() {
    if (this.#OnlineIndicator) {
      this.#OnlineIndicator.updateState();
    }
  }

 onInvitationReceived(invitation) {
    if (this.#InvitationsController) {
      this.#InvitationsController.onInvitationReceived(invitation);
    }
  }
}
