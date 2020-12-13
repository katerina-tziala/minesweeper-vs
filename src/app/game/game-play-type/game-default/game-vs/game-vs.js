"use strict";
import { clone, randomValueFromArray } from "~/_utils/utils.js";

import { GameType, GameVSMode } from "GameEnums";

import { Game } from "../_game";

import { GameVSDashboard } from "../../game-vs-dashboard/game-vs-dashboard";

export class GameVS extends Game {

  constructor(id, params, player, opponent) {
    super(id, params, player);
    this.opponent = opponent;
    this.players = [this.player, this.opponent];
    this.init();
    this.vsDashboard = new GameVSDashboard(this.#turnsLimit, !this.#isDetectMinesGoal);
  }
  
  // OVERRIDEN FUNCTIONS
  get gameTimerSettings() {
    const timerSettings = super.gameTimerSettings;
    if (this.#roundTimer) {
      timerSettings.step = -1;
      timerSettings.limit = 0;
      timerSettings.initialValue = this.turnSettings.turnDuration;
    }
    return timerSettings;
  }

  get playerOnTurn() {
    return this.players.find((player) => player.turn);
  }

  get detectedMines() {
    let detectedMines = 0;
    this.players.forEach((player) => (detectedMines += player.minesDetected));
    return detectedMines;
  }

  get boardActionButtons() {
    const boardActions = super.boardActionButtons;
    if (this.#sneakPeekAllowed) {
      boardActions.push(
        GameViewHelper.generateActionButton(
          ACTION_BUTTONS.sneakPeek,
          this.onSneakPeek.bind(this)
        )
      );
    }
    return boardActions;
  }

  generateView() {
    const gameContainer = super.generateView();
    const vsDashboard = this.vsDashboard.generateView(
      this.player,
      this.opponent
    );
    gameContainer.insertBefore(vsDashboard, gameContainer.firstChild);
    return gameContainer;
  }

  init() {
    this.players.forEach((player) => {
      player.initState(this.#isDetectMinesGoal ? this.levelSettings.numberOfMines : this.levelSettings.numberOfEmptyTiles);
      player.turn = (player.id === this.playerStartID);
    });
    this.initState();
  }

  start() {
    this.onAfterViewInit.then(() => {
      return this.vsDashboard.initCardsState(this.players);
    }).then(() => {
      this.initDashBoard();
      if (this.#roundTimer) {
        this.setGameStart();
      }
      console.log("start VS GAME");
      console.log(this.playerOnTurn);
      console.log("show start modal and start rounds");
      this.startGameRound();
    });
  }

  restart() {
    super.restart();
    this.playerStartID = randomValueFromArray(this.players.map(player => player.id));
    this.init();
    this.start();
  }

 

  // CLASS SPECIFIC FUNCTIONS
  get #roundTimer() {
    return this.turnSettings && this.turnSettings.turnTimer;
  }

  get #turnsLimit() {
    return this.turnSettings ? this.turnSettings.missedTurnsLimit : 0;
  }

  get #isDetectMinesGoal() {
    if (
      this.optionsSettings.vsMode &&
      this.optionsSettings.vsMode === GameVSMode.Detect
    ) {
      return true;
    }
    return false;
  }

  get #sneakPeekAllowed() {
    if (
      this.optionsSettings.sneakPeek &&
      this.optionsSettings.sneakPeekDuration
    ) {
      return true;
    }
    return false;
  }

  initRound() {
    this.roundTiles = [];
    this.players.forEach((player) => player.toggleTurn());
  }

  onSneakPeek() {
    console.log("onSneakPeek");
    return;
  }

  startGameRound() {
    this.initRoundTiles();


    this.mineField.enable();

  }

}
