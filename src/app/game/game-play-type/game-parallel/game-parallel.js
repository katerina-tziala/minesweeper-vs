"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { clone } from "~/_utils/utils.js";


import {
  valueDefined
} from "~/_utils/validator";


import { AppModel } from "~/_models/app-model";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DOM_ELEMENT_CLASS } from "./_game-parralel.constants";

import {
  VSDashboardController,
  BoardActionsController,
} from "GamePlayControllers";
import { SneakPeekCompetitionController, SneakPeekStrategyController } from "GamePlayControllers";

import { Game } from "../_game";

import { GameViewHelper } from "../game-default/_game-view-helper";
import { VSBoard } from "GamePlayComponents";

export class GameParallel extends Game {
  #_individualGames = [];
  #PlayerGame;
  #OpponentGame;
  #vsDashboard;
  #sneakPeekController;

  constructor(id, params, playerGame, opponentGame) {
    super(id, params);

    this.initState();
    this.#setIndividualGames(playerGame, opponentGame);
    this.#setPlayers();

    this.optionsSettings.openCompetition = false;
    console.log(this.optionsSettings);


    this.#sneakPeekController = new SneakPeekCompetitionController(this.#onSneakPeek.bind(this),
      this.#onSneakPeekEnd.bind(this),
      !this.optionsSettings.openCompetition);


    this.#vsDashboard = new VSDashboardController(this.wrongFlagHint);
  }

  get #openCompetition() {
    if (valueDefined(this.optionsSettings.openCompetition)) {
      return this.optionsSettings.openCompetition;
    }
    return true;
  }

  get #identicalMinefields() {
    if (valueDefined(this.optionsSettings.identicalMines)) {
      return this.optionsSettings.identicalMines;
    }
    return true;
  }

  #setIndividualGames(playerGame, opponentGame) {
    this.#PlayerGame = playerGame;
    this.#PlayerGame.player.turn = true;
    this.#PlayerGame.externalActions = {
      onMoveSubmission: this.#onPlayerGameMove.bind(this),
      onGameOverSubmission: this.#onPlayerGameOver.bind(this)
    };

    
    this.#OpponentGame = opponentGame;
    this.#OpponentGame.player.turn = false;
    this.#OpponentGame.externalActions = {
      onMoveSubmission: this.#onOpponentGameMove.bind(this),
      onGameOverSubmission: this.#onOpponentGameOver.bind(this)
    };
    this.#OpponentGame.minefieldInteractionAllowed = false;

    this.#_individualGames = [this.#PlayerGame, this.#OpponentGame];
  }

  #setPlayers() {
    this.players = [this.#player, this.#opponent];
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
    const vsDashboard = this.#vsDashboard.generateView(
      this.#player,
      this.#opponent,
    );
    const vsBoard = this.#generateVSBoardView();
    this.#vsDashboard.addElementInDashboard(vsDashboard, vsBoard);
    return vsDashboard;
  }

  #generateVSBoardView() {
    const vsBoard = VSBoard.generateView(this.#player.colorType, this.#opponent.colorType);
    const boardActions = this.boardActions;
    if (this.#sneakPeekController.allowed) {
      boardActions.append(this.#sneakPeekController.toggleButton);
    }
    vsBoard.append(boardActions);
    return vsBoard;
  }

  #generateGamingArea() {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gamingArea,
    ]);

    container.append(this.#generateGameView(this.#PlayerGame));

    const opponentGameView = this.#generateGameView(this.#OpponentGame);
    if (!this.#openCompetition) {
      ElementHandler.hide(opponentGameView);
    }
 
    container.append(opponentGameView);

    return container;
  }

  #gameContainerID(game) {
    return (
      DOM_ELEMENT_CLASS.gameContainer + TYPOGRAPHY.doubleUnderscore + game.id
    );
  }

  #gameContainer(game) {
    return ElementHandler.getByID(this.#gameContainerID(game));
  }

  #generateGameView(game) {
    const gameContainer = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.gameContainer],
      this.#gameContainerID(game),
    );
    gameContainer.append(game.generateView());
    return gameContainer;
  }



  #initMinesPositions() {
    if (!this.#identicalMinefields) {
      this.#individualGames.forEach((game) => game.setMinesPositions());
    } else {
      this.#PlayerGame.setMinesPositions();
      this.#OpponentGame.levelSettings.minesPositions = this.#PlayerGame.levelSettings.minesPositions;
    }
  }



  restart() {
    this.initState();
    this.#initMinesPositions();

    this.setGameStart();
    //this.#OpponentGame.initPlayer();



    // console.log("restart parallel");
    // console.log(this.isIdle);
    this.#individualGames.forEach((game) => {
      game.init();
      game.setGameStart();
      game.start();
      //console.log(game);


    });
    return;
  }


  start() {
    if (this.isOnline) {
      console.log("online gaming");

      //TODO: identical mines on online

      return;
    }
    this.#initMinesPositions();

    this.setGameStart();
    this.#individualGames.forEach((game) => {
      game.init();
      game.setGameStart();
      game.start();
      //console.log(game);



    });
    this.#sneakPeekController.timerControllerParentID = this.#OpponentGame.freezerId;
    
    this.#sneakPeekController.setControllerPlayer(this.#player);
  }



  #onPlayerGameMove(playerCardUpdate, gameData) {
    if (playerCardUpdate) {
      this.#updatePlayerCard(this.#PlayerGame);
    }
    if (this.isOnline) {
      console.log("send data online");
      console.log(gameData);
    }
  }

  #onOpponentGameMove() {
    this.#updatePlayerCard(this.#OpponentGame);
  }

  #onPlayerGameOver(gameData) {
    this.#onGameOver(gameData);

    this.#updatePlayerCard(this.#PlayerGame);

    console.log("onPlayerGameOver");
    console.log(this);

    this.#revealGameMinefield(this.#OpponentGame);
  }

  #onOpponentGameOver(gameData) {
    this.#onGameOver(gameData);
    this.#updatePlayerCard(this.#OpponentGame);

    console.log("onOpponentGameOver");
    console.log(this);

    this.#revealGameMinefield(this.#PlayerGame);
  }

  #onGameOver(gameData) {
    this.setGameEnd(gameData.gameOverType);
    this.#pauseGames();

    console.log("onGameOver");
    console.log(gameData);

  }




  #updatePlayerCard(game) {
    this.#vsDashboard.updatePlayerGameGoalStatistics(game.player, game.playerTargetValue);
  }

  #revealGameMinefield(game) {
    game.revealMinefield();
  }

  #onSneakPeek() {
    this.#gameContainer(this.#OpponentGame).then(gameContainer => {
      ElementHandler.display(gameContainer);
      return;
    }).then(() => {
      return this.#sneakPeekController.playerPeeking();
    }).catch((err) => {
      console.log(err);
      console.log("error on onSneakPeek");
    });
  }

  #onSneakPeekEnd() {
    this.#sneakPeekController.stopPeeking().then(() => {
      this.#OpponentGame.disableMinefield();
      return this.#gameContainer(this.#OpponentGame);
    }).then(gameContainer => {
      ElementHandler.hide(gameContainer);
      return;
    }).catch((err) => {
      console.log(err);
      console.log("error on onSneakPeekEnd");
    });
  }


  
  #pauseGames() {
    this.#individualGames.forEach((game) => game.pause());
  }

  pause() {
    this.#pauseGames();
    if (this.#sneakPeekController.isRunning) {
      this.#sneakPeekController.stop();
    }
  }

 

  continue() {
    if (this.#sneakPeekController.isPaused) {
      this.#sneakPeekController.continue();
    }
    this.#individualGames.forEach((game) => game.continue());
  }

}
