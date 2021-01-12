"use strict";
import { AppModel } from "~/_models/app-model";
import { nowTimestamp } from "~/_utils/dates";

export class RoundStatistics extends AppModel {

  constructor() {
    super();
    this.init();
  }

  init() {
    this.rounds = [];
    this.initRound();
  }

  initRound() {
    this.roundTiles = [];
    this.start = undefined;
    this.end = undefined;
  }

  set roundTilesUpdate(newMoveTiles = []) {
    this.roundTiles = this.roundTiles.concat(newMoveTiles);
  }

  initRoundStatistics() {
    this.initRound();
    this.start = nowTimestamp();
  }


  onRoundEnd(boardTiles) {
    this.roundTilesUpdate = boardTiles;
    this.end = nowTimestamp();
    this.#updateRounds();
  }

  #updateRounds() {
    this.rounds.push({
      start: this.start,
      end: this.end,
      tiles: this.roundTiles,
    });
  }

}
