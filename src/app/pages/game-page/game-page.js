"use strict";

import "../../../styles/pages/_game.scss";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { Page } from "../page";
// import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BOARD_SECTION } from "./game-page.constants";

// import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";

// import { User } from "~/_models/user";


// import { GamePlay } from "../../game/game-play/game-play";

export class GamePage extends Page {
  #_gameParams;
  #_game;

  constructor(gameParams, navigateToHome, onGameSetUpNavigation) {
    super();
    self.settingsController.gameSettingsHidden = true;
    this.gameParams = gameParams;
    this.navigateToHome = navigateToHome;
    this.onGameSetUpNavigation = onGameSetUpNavigation;

    console.log(this.gameParams);

    // this.gamePlay = new GamePlay(game, {
    //   onExit: this.onGameExit.bind(this),
    //   onReset: this.onGameReset.bind(this),
    // });

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

  renderPage(mainContainer) {


    // console.log(JSON.parse(JSON.stringify(this.game)));



    // mainContainer.addEventListener("contextmenu", event => {
    //   event.preventDefault();
    //   //console.log(event);
    // });

    // mainContainer.append(this.gamePlay.generateView());
    // this.gamePlay.start();
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
