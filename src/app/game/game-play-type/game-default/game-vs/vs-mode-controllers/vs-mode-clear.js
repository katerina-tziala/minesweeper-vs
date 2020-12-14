"use strict";
import { clone, randomValueFromArray } from "~/_utils/utils.js";

import { GameType, GameVSMode, GameEndType } from "GameEnums";
import { VSModeController } from "./_vs-mode-controller";

export class VSModeClear extends VSModeController {
  constructor(optionsSettings) {
    super(optionsSettings);
  }

  getFlaggingAllowed(player) {
    console.log("flagging allowed when clearing minefield");
    console.log(this.optionsSettings);
    console.log(player);
    return false;
  }

  getGameEndOnPlayerMove(player) {
    let gameEndType;
    if (player.clearedMinefield) {
      gameEndType = GameEndType.Cleared;
    }
    return gameEndType;
  }

  roundEnded(boardTiles) {
    return boardTiles.length && boardTiles[0].isRevealed;
  }
}
