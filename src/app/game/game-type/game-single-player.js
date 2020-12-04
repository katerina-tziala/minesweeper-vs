"use strict";
import { Game } from "./game";

export class GameSinglePlayer extends Game {

  constructor(id, params, player) {
    super(id, params, player);
  }

  init() {
    this.player.initState();
    this.player.turn = true;
    this.initState();
  }


  get detectedMines() {
    return this.optionsSettings.wrongFlagHint ? this.player.minesDetected : this.player.placedFlags;
  }

  get dashboardFaceColor() {
    if (this.vsMode && this.vsMode !== GameVSMode.Parallel) {
      return this.player.colorType;
    }
    return undefined;
  }


  start() {
    this.init();
    this.onAfterViewInit.then(() => {
      this.gameTimer.init();
      this.updateMineCounter();
      this.setSmileFace();

      console.log("re staaart original");

      //console.log(this);
      // this.game.roundTimer ? this.game.setGameStart() :

      // if (!this.game.singlePlayer) {
      //   console.log("show start modal");
      //   console.log(this.game.playerOnTurn);
      // }

      // this.startGameRound();
    });

  }







}
