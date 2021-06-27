"use strict";
import "../../../styles/pages/_game-setup.scss";
import { enumKey } from "~/_utils/utils";
import { Page } from "../page";
import { GameType } from "GameEnums";
export class GameSetupPage extends Page {
  #GameWizard;
  #gameType;
  #onPlayGame;

  constructor(onPageChange) {
    super(onPageChange);
  }

  get #wizardName() {
    return `GameWizard${enumKey(GameType, this.#gameType)}`;
  }

  #loadWizard() {
    const wizardName = this.#wizardName;
    return import("GameWizard").then((module) => {
      this.#GameWizard = new module[wizardName](this.#onCloseWizard.bind(this), this.#onGeneratedGameSetUp.bind(this));
      return this.#GameWizard.generateView();
    });
  }

  #onCloseWizard() {
    this.onPageChange();
  }

  #onGeneratedGameSetUp(gameParams) {
    if (this.#onPlayGame) {
      this.#onPlayGame(gameParams)
    }
  }

  renderPage(mainContainer) {
    this.#loadWizard().then(wizard => {
      mainContainer.append(wizard);
      this.hideLoader();
      this.#GameWizard.expandWizard();
    }).catch(() => {
      console.log("error on loading");
    });
  }

  init(gameType, onPlayGame) {
    this.#gameType = gameType;
    this.#onPlayGame = onPlayGame;
    super.init();
  }

  onDestroy() {
    this.#GameWizard = undefined;
    this.#gameType = undefined;
    this.#onPlayGame = undefined;
    super.onDestroy();
  }
}
