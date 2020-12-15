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

    //marks: true
    // wrongFlagHint: false
    // openStrategy: false
    // sneakPeek: false
    // sneakPeekDuration: 0
    // unlimitedFlags: true
    // vsMode: "clear"

  }

  get goalTargetNumber() {
    return this.levelSettings.numberOfEmptyTiles;
  }

  get boardActionButtons() {
    const boardActions = super.boardActionButtons;
    if (this.#sneakPeekAllowed) {
      const sneakPeekBtn = GameViewHelper.generateActionButton(ACTION_BUTTONS.sneakPeek,this.#onSneakPeek.bind(this));
      boardActions.push(sneakPeekBtn);
    }
    return boardActions;
  }

  flaggingAllowed(player) {
    console.log("flagging allowed when clearing minefield");
    console.log(this.optionsSettings);
    console.log(player);
    return false;
  }

  updateStateOnRevealedTiles(revealedTiles) {
    super.updateStateOnRevealedTiles(revealedTiles);
    this.pause();
    this.resetPlayerTurnsAfterMove().then(() => {
    
      if (this.mineField.isCleared) {
        this.setGameEnd(GameEndType.Cleared);
        this.onGameOver(revealedTiles);
        return;
      }
      this.onRoundEnd(revealedTiles);
    });
  }
  
  handleTileMarking(tile) {
    console.log("handleTileMarking");
    console.log(tile);
    this.pause();
    
  }



  get #sneakPeekAllowed() {
    if (this.optionsSettings.sneakPeek && this.optionsSettings.sneakPeekDuration) {
      return true;
    }
    return false;
  }

  #onSneakPeek() {
    console.log("onSneakPeek");
    return;
  }

  onPlayerMoveEnd(boardTiles = []) {
    this.moveTilesUpdate = boardTiles;
    this.playerOnTurn.increaseMoves();
  
    console.log("-- onPlayerMoveEnd --");

    // this.resetPlayerTurnsAfterMove().then(() => {
    
    //   if (this.isOnline) {
    //     console.log("submit online move");
    //     console.log(this.playerOnTurn);
    //     return;
    //   }

    //   this.mineField.enable();
    // });
  }


}
