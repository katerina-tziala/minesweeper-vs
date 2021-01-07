"use strict";

import { AppModel } from "~/_models/app-model";

export class TurnSettings extends AppModel {
  constructor() {
    super();
    this.turnTimer = true;
    this.turnDuration = 5;
    this.missedTurnsLimit = 3;
    this.consecutiveTurns = true;
    //default
    // this.turnDuration = 30;
    // this.missedTurnsLimit = 10;
    // this.consecutiveTurns = false;
  }

  get roundTimer() {
    return this.turnTimer && (this.turnDuration > 0);
  }

  get resetMissedTurns() {
    return this.roundTimer && this.consecutiveTurns;
  }

  get turnsLimit() {
    return this.roundTimer ? this.missedTurnsLimit : null;
  }

}
