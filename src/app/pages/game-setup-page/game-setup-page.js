"use strict";

import "../../../styles/pages/_game-setup.scss";
import { enumKey } from "~/_utils/utils";
import { Page } from "../page";
// import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";
import { GameType } from "GameEnums";
import { GameMessageVSController } from "GamePlayControllers";
import { LevelSettings, OptionsSettings, TurnSettings, Player, BotPlayer } from "GameModels";

export class GameSetupPage extends Page {
  #_gameType;

  constructor(gameType, navigateToHome, onPlayGame) {
    super();
    this.#gameType = gameType;
    this.navigateToHome = navigateToHome;
    this.onPlayGame = onPlayGame;
    self.settingsController.gameSettingsHidden = false;
    this.init();
  }

  set #gameType(type) {
    this.#_gameType = type;
  }

  get #gameType() {
    return this.#_gameType;
  }

  #loadWizard() {
    const wizardName = `GameWizard${enumKey(GameType, this.#_gameType)}`;
    return import("GameWizard").then((module) => {
      return new module[wizardName](this.navigateToHome, this.onPlayGame.bind(this));
    });
  }

  renderPage(mainContainer) {

    const mg = new GameMessageVSController();


    const player = new Player("kate", "Kate");
    player.colorType = "2";
    const bot = new BotPlayer();
    bot.colorType = "3";
    mainContainer.append(mg.generateView());
    this.hideLoader();


    const gameResults = {
      gameInfo: {
        duration: {
          hours: 0,
          minutes: 7,
          seconds: 35
        },
        draw: false,
        gameOverType: "clearedMinefield"
      },
      playersResults: [player.reportData, bot.reportData],
      reportResults: ["moves", "clearedTiles", "detectedMines", "flags", "marks", "clearedMinefield", "detonatedMine"]
    }

    mg.displayGameOverMessage(gameResults);


    return;

    // this.#loadWizard().then((gameWizard) => {
    //   this.gameWizard = gameWizard;
    //   this.gameWizard.generateView().then(wizard => {
    //     this.hideLoader();
    //     mainContainer.append(wizard);
    //     this.gameWizard.expandWizard();
    //   });
    // });

  }

  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);
    console.log("onConnectionError");
  }
}
