"use strict";
import { Game } from "./_game";

export class GameVS extends Game {

  constructor(id, params, player, opponent) {
    super(id, params, player);
    this.opponent = opponent;
    this.players = [this.player, this.opponent];
    this.init();
  }

  init() {
    this.players.forEach(player => {
      player.initState();
      player.turn = player.id === this.playerStartID;
    });
    this.initState();
  }

  get playerOnTurn() {
    return this.players.find(player => player.turn);
  }

  get detectedMines() {
    let detectedMines = 0;
    this.players.forEach(player => detectedMines += player.minesDetected);
    return detectedMines;
  }

  get gameTimerSettings() {
    const timerSettings = super.gameTimerSettings;
    if (this.#roundTimer) {
      timerSettings.step = -1;
      timerSettings.limit = 0;
      timerSettings.initialValue = this.turnSettings.turnDuration;
    }
    return timerSettings;
  }



  start() {
    this.onAfterViewInit.then(() => {
      this.initDashBoard();
      if (this.#roundTimer) {
        this.setGameStart();
      }

      console.log("re staaart VS");

      console.log(this.playerOnTurn);
      console.log("show start modal and start rounds");
      // this.startGameRound();
    });
  }

  initRound() {
    this.roundTiles = [];
    this.players.forEach(player => player.toggleTurn());
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


  get #roundTimer() {
    return this.turnSettings && this.turnSettings.turnTimer;
  }





}
