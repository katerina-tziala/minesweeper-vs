"use strict";
import { Game } from "./_game";

export class GameSinglePlayer extends Game {

  constructor(id, params, player) {
    super(id, params, player);
    this.init();
  }

  // OVERRIDEN FUNCTIONS
  get detectedMines() {
    return this.optionsSettings.wrongFlagHint ? this.player.minesDetected : this.player.placedFlags;
  }

  init() {
    this.player.initState();
    this.player.turn = true;
    this.initState();
  }

  start() {
    this.onAfterViewInit.then(() => {
      this.initDashBoard();


      // TODO
      //console.log("ON Parallel - start");

      console.log("re staaart original");
  
      
      // this.game.roundTimer ? this.game.setGameStart() :

      // if (!this.game.singlePlayer) {
      //
      //   console.log(this.game.playerOnTurn);
      // }

      // this.startGameRound();
    });

  }

}
