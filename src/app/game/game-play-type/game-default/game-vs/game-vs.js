"use strict";


import { GameType, GameVSMode } from "GameEnums";


import { Game } from "../_game";

import { GameVSDashboard } from "../../game-vs-dashboard/game-vs-dashboard";

export class GameVS extends Game {
  constructor(id, params, player, opponent) {
    super(id, params, player);
    this.opponent = opponent;
    this.players = [this.player, this.opponent];
    this.vsDashboard = new GameVSDashboard(!this.#isDetectMinesGoal, this.#turnsLimit);
    this.init();
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
    const vsDashboard = this.vsDashboard.generateView(this.player, this.opponent);
    gameContainer.insertBefore(vsDashboard, gameContainer.firstChild);
    return gameContainer;
  }

  init() {
    this.players.forEach((player) => {
      player.initState();
      player.turn = player.id === this.playerStartID;
    });
    this.initState();
  }

  start() {
    this.onAfterViewInit.then(() => {
      this.initDashBoard();
      if (this.#roundTimer) {
        this.setGameStart();
      }

      console.log("start VS GAME --- can be online");

      console.log(this.playerOnTurn);
      console.log("show start modal and start rounds");
      // this.startGameRound();
    });
  }

  startGameRound() {
    // this.game.startRound();
    // this.#setDashboardRoundState();
    // if (this.game.roundTimer) {
    //   this.#timeCounter.start();
    // }
    // if (!this.game.singlePlayer) {
    //   console.log("set round styles");
    // }
    // this.mineField.toggleMinefieldFreezer(false);
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
}
