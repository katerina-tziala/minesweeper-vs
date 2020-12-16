"use strict";
// import { clone, randomValueFromArray } from "~/_utils/utils.js";

import { GameEndType } from "GameEnums";

// import { Game } from "../_game";

// import { GameVSDashboard } from "../../game-vs-dashboard/game-vs-dashboard";

// import { VSModeDetect } from "./vs-mode-controllers/vs-mode-detect";
import {
  ACTION_BUTTONS,
  BOARD_SECTION,
  DASHBOARD_SECTION,
} from "../_game.constants";

import { GameViewHelper } from "../_game-view-helper";

import { GameVS } from "./_game-vs";

export class GameVSClear extends GameVS {
  constructor(id, params, player, opponent) {
    super(id, params, player, opponent);

  
    // this.optionsSettings.allowFlagging = true;
    //marks: true
    // wrongFlagHint: false
    // openStrategy: false
    // sneakPeek: false
    // sneakPeekDuration: 0
    // unlimitedFlags: true
    // vsMode: "clear"
  }

  get #sneakPeekAllowed() {
    if (
      this.optionsSettings.sneakPeek &&
      this.optionsSettings.sneakPeekDuration
    ) {
      return true;
    }
    return false;
  }

  get goalTargetNumber() {
    return this.levelSettings.numberOfEmptyTiles;
  }

  get boardActionButtons() {
    const boardActions = super.boardActionButtons;
    if (this.#sneakPeekAllowed) {
      const sneakPeekBtn = GameViewHelper.generateActionButton(
        ACTION_BUTTONS.sneakPeek,
        this.#onSneakPeek.bind(this),
      );
      boardActions.push(sneakPeekBtn);
    }
    return boardActions;
  }

  get flaggingAllowedBySettings() {
    if (this.optionsSettings.allowFlagging !== undefined) {
      return this.optionsSettings.allowFlagging;
    }
    return true;
  }

  flaggingAllowed(tile, player = this.playerOnTurn) {
    return this.flaggingAllowedBySettings  && this.flagOnTileAllowedByPlayer(tile) && player.hasFlags;
  }

  updateStateOnRevealedTiles(revealedTiles) {
    this.pause();
    super.updateStateOnRevealedTiles(revealedTiles);

 //  this.resetPlayerTurnsAfterMove().then(() => {
      if (this.mineField.isCleared) {
        this.setGameEnd(GameEndType.Cleared);
        this.onGameOver(revealedTiles);
        return;
      }
      this.onRoundEnd(revealedTiles);
  // });
  }


  



  updateStateOnFlaggedTile(tile) {
    this.pause();
    this.setFlagOnMinefieldTile(tile);
    this.onPlayerMoveEnd([tile]);
  }

  updateStateOnMarkedTile(tile) {
    this.pause();
    this.setMarkOnMinefieldTile(tile);
    this.onPlayerMoveEnd([tile]);
  }

  updateStateOnResetedTile(tile) {
    this.pause();
    this.resetMinefieldTile(tile);
    this.onPlayerMoveEnd([tile]);
  }

  onPlayerMoveEnd(boardTiles = []) {
    this.roundTilesUpdate = boardTiles;
  //  this.updatePlayerTurnsAndAllowedFlags().then(() => {
      console.log("-- onPlayerMoveEnd --");
      if (this.isOnline) {
        console.log("submit online move");
        console.log(this.playerOnTurn);
        return;
      }
  
      this.mineField.enable();

    //});
  }


  #onSneakPeek() {
    console.log("onSneakPeek");
    return;
  }
}
