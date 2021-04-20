"use strict";

import { AppModel } from "~/_models/app-model";

export class TurnSettings extends AppModel {
  constructor(turnTimer = true) {
    super();
    this.turnTimer = turnTimer;
    this.#setDefaultValues();
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

  #setDefaultValues() {
    if (this.turnTimer) {
      this.turnDuration = 5;
      this.missedTurnsLimit = 3;
      this.consecutiveTurns = true;
      //default
      // this.turnDuration = 30;
      // this.missedTurnsLimit = 10;
      // this.consecutiveTurns = false;
      return;
    }
    this.#setSettingsWhenNoTurnTimer();
  }

  update(updateData) {
    super.update(updateData);
    if (!this.turnTimer) {
      this.#setSettingsWhenNoTurnTimer();
    }
  }

  #setSettingsWhenNoTurnTimer() {
    this.turnDuration = 0;
    this.missedTurnsLimit = 0;
    this.consecutiveTurns = false;
  }
}
