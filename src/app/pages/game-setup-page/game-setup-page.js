"use strict";
import "../../../styles/pages/_game-setup.scss";
import { enumKey } from "~/_utils/utils";
import { Page } from "../page";
import { GameType } from "GameEnums";
import { HeaderActionsControllerUser } from "~/controllers/header-actions-controller/header-actions-controller-user";

export class GameSetupPage extends Page {
  #originPage;
  #gameType;
  #GameWizard;

  constructor(onPageChange, onPlayGame, originPage, gameType) {
    super(onPageChange);
    this.#originPage = originPage;
    this.#gameType = gameType;
    this.onPlayGame = onPlayGame;
    this.ActionsControlller = new HeaderActionsControllerUser(true, {
      "onLogout": this.onLogout.bind(this)
    });
    this.init();
  }

  get #wizardName() {
    return `GameWizard${enumKey(GameType, this.#gameType)}`;
  }

  #loadWizard() {
    const wizardName = this.#wizardName;
    return import("GameWizard").then((module) => {
      return new module[wizardName](this.#onCloseWizard.bind(this), this.onPlayGame.bind(this));
    });
  }

  #onCloseWizard() {
    this.onPageChange(this.#originPage);
  }

  renderPage(mainContainer) {
    this.#loadWizard().then((gameWizard) => {
      this.#GameWizard = gameWizard;
      return this.#GameWizard.generateView();
    }).then(wizard => {
      mainContainer.append(wizard);
      this.hideLoader();
      this.#GameWizard.expandWizard();
      console.log(this.#originPage);
    }).catch(() => {
      console.log("error on loading");
    });
  }

}
