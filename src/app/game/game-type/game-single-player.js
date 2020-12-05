"use strict";
import { Game } from "./game";

export class GameSinglePlayer extends Game {

  constructor(id, params, player) {
    super(id, params, player);
    this.init();
  }

  init() {
    this.player.initState();
    this.player.turn = true;
    this.initState();
  }

  get detectedMines() {
    return this.optionsSettings.wrongFlagHint ? this.player.minesDetected : this.player.placedFlags;
  }

  start() {
    this.onAfterViewInit.then(() => {
      this.initDashBoard();

      console.log("re staaart original");
      console.log("show start modal when not parallel else start");
      //console.log(this);
      // this.game.roundTimer ? this.game.setGameStart() :

      // if (!this.game.singlePlayer) {
      //
      //   console.log(this.game.playerOnTurn);
      // }

      // this.startGameRound();
    });

  }







}
