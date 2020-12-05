"use strict";
import { AppModel } from "~/_models/app-model";

export class GameParallel extends AppModel {

  constructor(id, playerGame, opponentGame) {
    super();
    this.id = id ? id : this.type;
    this.playerGame = playerGame;
    this.opponentGame = opponentGame;
    console.log("GameParallel");
  }

  generateView() {
    //const gameContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], this.#gameContainerID);
    const gameContainer = document.createDocumentFragment();
    //gameContainer.append(GameViewHelper.generateBoard(this.id));
    return gameContainer;
  }
  start() {
    console.log("start parallel");
    // this.onAfterViewInit.then(() => {
    //   this.initDashBoard();

    //   console.log("re staaart original");
    //   console.log("show start modal when not parallel else start");
    //   //console.log(this);
    //   // this.game.roundTimer ? this.game.setGameStart() :

    //   // if (!this.game.singlePlayer) {
    //   //
    //   //   console.log(this.game.playerOnTurn);
    //   // }

    //   // this.startGameRound();
    // });

  }
}