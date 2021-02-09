"use strict";
import "../../../styles/pages/_game.scss";
import { Page } from "../page";

// import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";
import { HeaderActionsControllerUser } from "~/controllers/header-actions-controller/header-actions-controller-user";
import { GameFactory } from "../../game/game-factory";
export class GamePage extends Page {
  #gameParams;
  #Game;

  constructor(onPageChange, gameParams) {
    super(onPageChange);
    this.#gameParams = gameParams;

    // this.gameParams = gameParams;
    // this.navigateToHome = navigateToHome;
    // this.onGameSetUpNavigation = onGameSetUpNavigation;
    this.ActionsControlller = new HeaderActionsControllerUser(false, {
      "onLogout": this.onLogout.bind(this)
    });
    this.init();

  }

  #onGameLoaded() {
    return GameFactory.loadGame(this.#gameParams).then((game) => {
      this.#Game = game;
      this.#Game.externalActions = {
        quit: this.#onGameExit.bind(this),
        reset: this.#onGameReset.bind(this),
      };
      return;
    });
  }

  renderPage(mainContainer) {
    this.#onGameLoaded().then(() => {
      return this.#Game.generateView();
    }).then(gameView => {
      mainContainer.append(gameView);
      this.hideLoader();
      this.#Game.start();
    }).catch(() => {
      console.log("error on loading");
    });
  }

  onLogout() {
    console.log("onLogout from game");
    console.log(self.user);
    // console.log(self.onlineConnection.live);
    // console.log("on connection loggout");
    // //   if (this.page === PageType.Game) {
    // //     console.log("loggout in game?");
    // //     return;
    // //   }
    // LocalStorageHelper.remove("username");
    // self.user = undefined;
    // this.onPageChange();
  }

  onConnectionError(errorType) {
    console.log("onConnectionError from page");
    console.log(errorType);
  }

  onUserUpdate() {
    console.log("onUserUpdate from page");
  }

  #onGameExit() {
    console.log("#onGameExit");
    console.log("notify connection");
    // this.navigateToHome();
  }

  #onGameReset() {
    console.log("onGameReset");
    console.log("notify connection");
    //this.#saveCurrentGameSetUp();
    // this.onGameSetUpNavigation(this.game.type);
  }

  // #saveCurrentGameSetUp() {
  //   const gameSetUp = { ...this.game };
  //   delete gameSetUp.id;
  //   delete gameSetUp.player;
  //   delete gameSetUp.opponent;

  //   //   LocalStorageHelper.save("gameSetup", gameSetUp);
  // }
}
