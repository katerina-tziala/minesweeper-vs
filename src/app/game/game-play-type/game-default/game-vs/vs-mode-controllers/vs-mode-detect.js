"use strict";
import { clone, randomValueFromArray } from "~/_utils/utils.js";

import { GameType, GameVSMode, GameEndType } from "GameEnums";

import { VSModeController } from "./_vs-mode-controller";

export class VSModeDetect extends VSModeController {

  constructor(optionsSettings) {
    super(optionsSettings);
  }

  get revealingAllowed() {
    if (this.optionsSettings.tileRevealing !== undefined) {
      return this.optionsSettings.tileRevealing;
    }
    return true;
  }

  getGameEndOnPlayerMove(player) {
    let gameEndType;
    if (player.detectedMines) {
      gameEndType = GameEndType.Detected;
    }
    return gameEndType;
  }

  roundEnded(boardTiles) {
    return (boardTiles.length && boardTiles[0].isFlagged);
  }

}
