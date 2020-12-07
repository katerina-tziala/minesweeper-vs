"use strict";

import "../../../styles/pages/_game.scss";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { Page } from "../page";

// import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BOARD_SECTION } from "./game-page.constants";

// import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";

// import { User } from "~/_models/user";

import { GameFactory } from "../../game/game-factory";
import { Player } from "GameModels";
// import { GameVSMode } from "GameEnums";

import { GamePlayerCard } from "../../game/game-play-components/game-player-card/game-player-card";
export class GamePage extends Page {
  #_gameParams;
  #_game;

  constructor(gameParams, navigateToHome, onGameSetUpNavigation) {
    super();
    self.settingsController.gameSettingsHidden = false;
    this.gameParams = gameParams;
    this.navigateToHome = navigateToHome;
    this.onGameSetUpNavigation = onGameSetUpNavigation;

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

    // const a = new Player("asd", "kate");
    // const b = new Player("asdb", "angie asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd")
    // a.initState();
    // b.initState();
    // a.colorType = LocalStorageHelper.appSettings.playerColorType;
    // a.entered = false;

    // // b.entered = false;
    // b.colorType = LocalStorageHelper.appSettings.opponentColorType;
    // b.isBot = true;

    // a.turn = false;
    // b.turn = true;
    // // b.allowedFlags = 1;
    // // a.allowedFlags = 0;

    // mainContainer.append(GamePlayerCard.generate(a, 10, false, false));
    // mainContainer.append(GamePlayerCard.generate(b, undefined, true, true));


    // setTimeout(() => {
    //   a.turn = true;
    //   b.turn = false;
    //   a.allowedFlags = 15;
    //   a.revealedPositions = [2];
    //   //console.log("update", a);


    //   a.missedTurns = 3;
    //   GamePlayerCard.updateTurnStatus(a)
    //   GamePlayerCard.updateTurnStatus(b)



    // }, 2000);





    // mainContainer.append(card.generate());
    // GameFactory.loadGame(this.gameParams).then(game => {
    //   this.game = game;
    //   if (this.game) {
    //     mainContainer.append(this.game.generateView());
    //     this.game.start();
    //   } else {
    //     console.log("no game");
    //   }
    // });
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
