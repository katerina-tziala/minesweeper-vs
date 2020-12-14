"use strict";
// import { clone, randomValueFromArray } from "~/_utils/utils.js";

// import { GameType, GameVSMode, GameEndType } from "GameEnums";

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

  updateStateOnRevealedTiles(revealedTiles) {
    super.updateStateOnRevealedTiles(revealedTiles);
    console.log("updateStateOnRevealedTiles");
    console.log("check game over on minefield state after revealing");
    this.pause();
    console.log("round end");

    // if (this.playerOnTurn.clearedMinefield) {
    //   this.setGameEnd(GameEndType.Cleared);
    //   this.onGameOver(revealedTiles);
    //   return;
    // }
    // this.onPlayerMoveEnd(revealedTiles);


    // this.resetPlayerTurnsAfterMove().then(() => this.onPlayerMoveEnd(revealedTiles));
  }
  
  flaggingAllowed(player) {
    console.log("flagging allowed when clearing minefield");
    console.log(this.optionsSettings);
    console.log(player);
    return false;
  }

  handleTileMarking(tile) {
    console.log("handleTileMarking");
    console.log(tile);

    
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

}
