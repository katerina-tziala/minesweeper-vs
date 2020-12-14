"use strict";
import { clone, randomValueFromArray } from "~/_utils/utils.js";

import { GameType, GameVSMode, GameEndType } from "GameEnums";

export class VSModeController {
  constructor(optionsSettings) {
    this.optionsSettings = optionsSettings;

    console.log(this.optionsSettings);
  }

  get revealingAllowed() {
    return true;
  }

  getFlaggingAllowed(player) {
    return player.hasFlags;
  }

  getGameEndOnPlayerMove(player) {
    return undefined;
  }

  roundEnded(boardTiles) {
    return true;
  }
}
