"use strict";
import "../../../styles/pages/_game.scss";
import { Page } from "../page";
import { GameAction } from "GameEnums";
import { HeaderActionsControllerUser } from "~/controllers/header-actions-controller/header-actions-controller-user";
import { GameFactory } from "../../game/game-factory";
export class GamePage extends Page {
  #gameParams;
  #Game;
  #onGameSetUpNavigation;

  constructor(onPageChange, gameParams, onGameSetUpNavigation) {
    super(onPageChange);
    this.#gameParams = gameParams;
    this.#onGameSetUpNavigation = onGameSetUpNavigation;
    this.ActionsControlller = new HeaderActionsControllerUser(false, {
      "onLogout": this.onLogout.bind(this)
    });
    this.init();
  }

  #onGameLoaded() {
    return GameFactory.loadGame(this.#gameParams).then((game) => {
      this.#Game = game;
      this.#Game.externalActions = {
        onBoardMenuAction: this.#onBoardMenuAction.bind(this),
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

  #onOfflineBoardMenuAction(actionType) {
    switch (actionType) {
      case GameAction.Quit:
        this.onPageChange();
        break;
      case GameAction.Reset:
        this.#onGameSetUpNavigation(this.#Game.type);
        break;
      case GameAction.Restart:
        this.#Game.restart();
        break;
    }
  }

  #onBoardMenuAction(actionType) {
    if (this.#Game.isOnline && self.onlineConnection.live) {
      console.log("action on online gaming");
      console.log(actionType);
      return;
    }
    this.#onOfflineBoardMenuAction(actionType);
  }

  onLogout() {
    this.#Game.pause();
    if (this.#Game.isOnline && self.onlineConnection.live) {
      console.log("onLogout from  online game");
      console.log(self.user);
      console.log(actionType);
      return;
    }
    super.onLogout();
  }

  onConnectionError(errorType) {
    console.log("onConnectionError from page");
    console.log(errorType);
    this.#Game.pause();
  }

  onUserUpdate() {
    console.log("onUserUpdate from page");
  }

}
