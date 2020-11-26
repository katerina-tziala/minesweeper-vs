"use strict";
import { AppModel } from "~/_models/app-model";


export class Game extends AppModel {
  // #id;
  // #type;
  // #levelSettings = undefined;
  // #optionsSettings = undefined;
  // #turnSettings = undefined;


  // #player = undefined;
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
  }

  setMinesPositions() {
    this.levelSettings.setMinesPositions();
    this.minesToDetect = this.levelSettings.minesPositions.length;
  }







}