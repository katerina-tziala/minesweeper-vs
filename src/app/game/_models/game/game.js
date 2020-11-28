"use strict";
import { AppModel } from "~/_models/app-model";
import { getRandomValueFromArray } from "~/_utils/utils";

export class Game extends AppModel {
  // #id;
  // #type;
  // #levelSettings = undefined;
  // #optionsSettings = undefined;
  // #turnSettings = undefined;


  #players = [];
  #playerOnTurn;
  // #opponent = undefined;



  //#minesToDetect;
  // #startedAt;
  // #completedAt;
  // #gameOver;
  // #timerSeconds;


  constructor(type, params, player, opponent) {
    super();
    this.id = type;
    this.type = type;
    this.player = player;
    this.opponent = opponent;
    this.isOnline = false;
    this.update(params);
    this.players = player;
    this.players = opponent;
  }

  set players(player) {
    if (player) {
      this.#players.push(player);
    }
  }

  get players() {
    return this.#players;
  }


  init() {
    //console.log("init game");
    this.setMinesPositions();
    this.initTurns();
  }

  setMinesPositions() {
    this.levelSettings.setMinesPositions();
    this.minesToDetect = this.levelSettings.minesPositions.length;
  }

  initTurns() {
    const playerStartID = getRandomValueFromArray(this.players.map(player => player.id));
    this.players.find(player => player.id === playerStartID).turn = true;
  }


  get playerOnTurn() {
    return this.players.find(player => player.turn);
  }




}