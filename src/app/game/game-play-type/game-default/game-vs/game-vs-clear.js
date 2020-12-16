"use strict";
// import { clone, randomValueFromArray } from "~/_utils/utils.js";

import { GameEndType, GameSubmission } from "GameEnums";

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

  getPlayerTargetValue(player) {
    console.log(player);
    return 555;
  }

  // get flaggingAllowedBySettings() {
  //   if (this.optionsSettings.tileFlagging !== undefined) {
  //     return this.optionsSettings.tileFlagging;
  //   }
  //   return true;
  // }

  // flaggingAllowed(tile, player = this.playerOnTurn) {
  //   return this.flaggingAllowedBySettings  && this.flagOnTileAllowedByPlayer(tile) && player.hasFlags;
  // }

  updateStateOnRevealedTiles(revealedTiles) {
    this.pause();
    super.updateStateOnRevealedTiles(revealedTiles);

    console.log("updateStateOnRevealedTiles", "GameVSClear");
    //  //  this.resetPlayerTurnsAfterMove().then(() => {
    //       if (this.mineField.isCleared) {
    //         this.setGameEnd(GameEndType.Cleared);
    //         this.onGameOver(revealedTiles);
    //         return;
    //       }
    //       this.onRoundEnd(revealedTiles);
    //   // });
  }

  handleTileMarking(tile) {
    console.log("handleTileMarking", tile);
    // if (this.flaggingAllowed(tile)) {
    //   // set flag
    //   this.updateStateOnFlaggedTile(tile);
    //   return;
    // }

    // if (this.markingAllowed(tile)) {
    //   // set mark
    //   this.updateStateOnMarkedTile(tile);
    //   return;
    // }

    // if (this.resetingAllowed(tile)) {
    //   // reset
    //   this.updateStateOnResetedTile(tile);
    //   return;
    // }

    this.mineField.enable();
  }

  updateStateOnFlaggedTile(tile) {
    this.pause();
    this.setFlagOnMinefieldTile(tile);

    console.log("updateStateOnFlaggedTile", "GameVSClear");
    //this.onPlayerMoveEnd([tile]);
  }

  updateStateOnMarkedTile(tile) {
    this.pause();
    this.setMarkOnMinefieldTile(tile);
    // this.onPlayerMoveEnd([tile]);

    console.log("updateStateOnMarkedTile", "GameVSClear");
  }

  updateStateOnResetedTile(tile) {
    this.pause();
    this.resetMinefieldTile(tile);

    console.log("updateStateOnResetedTile", "GameVSClear");
    // this.onPlayerMoveEnd([tile]);
  }

  onPlayerMoveEnd(boardTiles = []) {
    this.roundTilesUpdate = boardTiles;
    if (this.isOnline) {
      //TODO:
      console.log("--  submit online move --");
      console.log("GameVSDetect");
      console.log("----------------------------");
      this.submitResult(GameSubmission.MoveEnd);
      console.log("decide how game is continued for this player");
      this.pause();
      return;
    }
    console.log(this);
    this.mineField.enable();
  }


  #onSneakPeek() {
    console.log("onSneakPeek");
    return;
  }

  // updatePlayerTurnsAndAllowedFlags(player = this.playerOnTurn) {
  //   const playerUpdates = [this.updatePlayerAllowedFlags(player)];
  //   playerUpdates.push(this.resetPlayerTurnsAfterMove());
  //   return Promise.all(playerUpdates);
  // }
}
