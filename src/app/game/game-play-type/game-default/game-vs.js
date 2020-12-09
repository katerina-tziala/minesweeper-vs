"use strict";
import { Game } from "./_game";

export class GameVS extends Game {
  constructor(id, params, player, opponent) {
    super(id, params, player);
    this.opponent = opponent;
    this.players = [this.player, this.opponent];
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
    if (this.sneakPeekAllowed) {
      boardActions.push(
        GameViewHelper.generateActionButton(
          ACTION_BUTTONS.sneakPeek,
          this.onSneakPeek.bind(this)
        )
      );
    }
    return boardActions;
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

  get sneakPeekAllowed() {
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
