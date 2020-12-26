"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { clone } from "~/_utils/utils.js";

import { AppModel } from "~/_models/app-model";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DOM_ELEMENT_CLASS } from "./_game-parralel.constants";

import { VSDashboardController } from "GamePlayControllers";

import { Game } from "../_game";





export class GameParallel extends Game {
  #_individualGames = [];
  #PlayerGame;
  #OpponentGame;
  

  constructor(id, params, playerGame, opponentGame) {
    super(id, params);
    this.#setIndividualGames(playerGame, opponentGame);
   
    //console.log(this);
    this.vsDashboard = new VSDashboardController(this.wrongFlagHint);

  }

  #setIndividualGames(playerGame, opponentGame) {
    this.#PlayerGame = playerGame;
   
    opponentGame.player.turn = false;
    this.#OpponentGame = opponentGame;
    
    this.#_individualGames = [this.#PlayerGame, this.#OpponentGame];
  }

  get #individualGames() {
    return this.#_individualGames;
  }

  get #player() {
    return this.#PlayerGame.player;
  }

  get #opponent() {
    return this.#OpponentGame.player;
  }


  generateView() {
    const gameContainer = document.createDocumentFragment();
    gameContainer.append(this.#generateDashboardView());
    gameContainer.append(this.#generateGamingArea());
    return gameContainer;
  }

  #generateDashboardView() {
    // const opponent = this.#opponentData;
    // opponent.turn = false;
    console.log("twra");
    

    console.log(this.#player, this.#opponent);
  

    const dashboard = this.vsDashboard.generateView(this.#player, this.#opponent);

    return dashboard;
  }

  



  #generateGamingArea() {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gamingArea,
    ]);
    this.#individualGames.forEach((game) => {
      container.append(this.#generateGameView(game));
    });
    return container;
  }

  #gameContainerID(gameID) {
    return DOM_ELEMENT_CLASS.container + TYPOGRAPHY.doubleUnderscore + gameID;
  }

  #generateGameView(game) {
    const gameContainer = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.gameContainer],
      this.#gameContainerID(game.id),
    );
    gameContainer.append(game.generateView());
    return gameContainer;
  }

  start() {
    console.log("start parallel");

    this.#individualGames.forEach((game) => {
      game.start();

      //console.log(game);
    });
  }
}
