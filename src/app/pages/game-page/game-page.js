"use strict";
import "../../../styles/pages/_game.scss";
import { Page } from "../page";
import { GameAction } from "GameEnums";
import { GameFactory } from "../../game/game-factory";

export class GamePage extends Page {
  #gameParams;
  #Game;
  #onGameSetUpNavigation;

  constructor(onPageChange) {
    super(onPageChange);
  }

  get gameSettingsAllowed() {
    return false;
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

  init(gameParams, onGameSetUpNavigation) {
    this.#gameParams = gameParams;
    this.#onGameSetUpNavigation = onGameSetUpNavigation;
    super.init();
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

  onConnectionError(errorType) {
    console.log("onConnectionError from page");
    console.log(errorType);
    this.#Game.pause();
  }

  onUserUpdate() {
    console.log("onUserUpdate from page");
  }

  onDestroy() {
    this.#Game.pause();
    super.onDestroy();
  }

  exitGame(id) {
    if (this.#Game && this.#Game.id === id) {
      const online = this.#Game.isOnline;
      this.onDestroy();
      return online;
    }
    return false;
  }
}
