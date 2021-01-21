"use strict";

import "../../../styles/pages/_game-setup.scss";
import { enumKey } from "~/_utils/utils";
import { Page } from "../page";
// import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";
import { GameType } from "GameEnums";
import {
  GameMessageController,
  GameMessageVSController
} from "GamePlayControllers";


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

    const gmc = new GameMessageVSController();

    mainContainer.append(gmc.generateView());


    const player = new Player("KateId", "Kate");
    player.colorType = "4";

    const bot = new BotPlayer();
    bot.colorType = "2";
    const playerReport = player.reportData;
    playerReport.sneakPeeks = 3;
    playerReport.sneakPeeksDuration = {
      hours: 5,
      minutes: 1,
      seconds: 12
    };
    const botReport = bot.reportData;
    botReport.sneakPeeks = 0;
    botReport.sneakPeeksDuration = {
      hours: 0,
      minutes: 0,
      seconds: 0
    };


    //  gmc.displayStartMessage(player).then(() => {
    //    console.log("done");
    //  });

    // DetonatedMine: "detonatedMine",
    // Cleared: "clearedMinefield",
    // ExceededTurnsLimit: "exceededTurnsLimit",
    // Detected: "detectedAllMines"
    const gameResults = {
      gameInfo: {
        duration:{
          hours: 1,
          minutes: 0,
          seconds: 35
        },
        draw: false,
        gameOverType: "clearedMinefield",
        rounds: 5
      },
      playersResults: [playerReport, botReport],
      reportResults: [
        "moves",
        "clearedTiles",
        "detectedMines",
        "flags",
        "marks",
        "detonatedMine",
        "exceededTurnsLimit",
        "sneakPeeks",
        "sneakPeeksDuration"
      ]
    };


    // console.log(gameResults);


    gmc.displayGameOverMessage(gameResults);
    // gmc.displayManualTurnMessage(player).then(() => {
    //   console.log("closed");
    // });

    
    this.hideLoader();


    return;




    this.#loadWizard().then((gameWizard) => {
      this.gameWizard = gameWizard;
      this.gameWizard.generateView().then(wizard => {
        this.hideLoader();
        mainContainer.append(wizard);
        this.gameWizard.expandWizard();
      });
    });
  }

  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);
    console.log("onConnectionError");
  }
}
