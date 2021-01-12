"use strict";
import "../../../styles/pages/_game.scss";
import { Page } from "../page";

// import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";

import { GameFactory } from "../../game/game-factory";
export class GamePage extends Page {
  #_gameParams;
  #_game;

  constructor(gameParams, navigateToHome, onGameSetUpNavigation) {
    super();
    self.settingsController.gameSettingsHidden = true;
    this.gameParams = gameParams;
    this.navigateToHome = navigateToHome;
    this.onGameSetUpNavigation = onGameSetUpNavigation;
    this.init();
  }

  set gameParams(gameParams) {
    this.#_gameParams = gameParams;
  }

  get gameParams() {
    return this.#_gameParams;
  }

  set game(game) {
    this.#_game = game;
  }

  get game() {
    return this.#_game;
  }


  #onGameLoaded(game) {
    this.game = game;
    this.game.externalActions = {
      quit: this.onGameExit.bind(this),
      reset: this.onGameReset.bind(this),
    };
  }

  renderPage(mainContainer) {

   



    GameFactory.loadGame(this.gameParams).then((game) => {

      this.#onGameLoaded(game);
      if (this.game) {
        mainContainer.append(this.game.generateView());
        this.hideLoader();
        this.game.start();
      } else {
        console.log("no game");
      }


    });
  }

  // Overridden functions
  onConnectionError(errorMessage) {
    //super.onConnectionError(errorMessage);
  }

  onGameExit() {
    console.log("onGameExit");
    console.log("notify connection");
    this.navigateToHome();
  }

  onGameReset() {
    console.log("onGameReset");
    console.log("notify connection");

    //this.#saveCurrentGameSetUp();
    this.onGameSetUpNavigation(this.game.type);
  }

  #saveCurrentGameSetUp() {
    const gameSetUp = { ...this.game };
    delete gameSetUp.id;
    delete gameSetUp.player;
    delete gameSetUp.opponent;

    //   LocalStorageHelper.save("gameSetup", gameSetUp);
  }
}
