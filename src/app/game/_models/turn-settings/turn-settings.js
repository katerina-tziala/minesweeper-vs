"use strict";

import { AppModel } from "~/_models/app-model";

export class TurnSettings extends AppModel {

  constructor() {
    super();
    this.turnTimer = true;
    this.turnDuration = 30;
    this.missedTurnsLimit = 10;
    this.consecutiveTurns = false;
  }

}