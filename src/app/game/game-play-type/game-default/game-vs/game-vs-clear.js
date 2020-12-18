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

  get goalTargetNumber() {
    return this.levelSettings.numberOfEmptyTiles;
  }

  getPlayerTargetValue(player) {
    return player.revealedTiles;
  }

  get strategyAllowed() {
    if (this.optionsSettings.tileFlagging !== undefined) {
      return this.optionsSettings.tileFlagging;
    }
    return true;
  }

  get openStrategy() {
    return (
      this.strategyAllowed &&
      this.optionsSettings &&
      this.optionsSettings.openStrategy
    );
  }

  flaggingAllowed(tile, player = this.playerOnTurn) {
    // console.log("flagOnTileAllowedByPlayer", this.flagOnTileAllowedByPlayer(tile));

    return this.flagOnTileAllowedByPlayer(tile);
  }

  revealingAllowed(tile) {
    if (this.openStrategy) {
      return true;
    }
    return super.revealingAllowed(tile);
  }

  handleTileRevealing(tile) {
    if (this.revealingAllowed(tile)) {
      this.revealMinefieldArea(tile);
      return;
    }
    this.mineField.enable();
  }

  updateStateOnRevealedTiles(revealedTiles) {
    const revealedPositions = this.mineField.getTilesPositions(revealedTiles);
    super.updateStateOnRevealedTiles(revealedTiles);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    const playerFlagsAffected = this.playerOnTurn.inTouchedTiles(revealedPositions);
    
    if (this.mineField.isCleared) {
      this.setGameEnd(GameEndType.Cleared);
    }
 
    const playerCardsUpdates = [this.updatePlayerCard(missedTurnsUpdated, true, playerFlagsAffected)];
    
    if (this.playerTouchedTilesAffected(revealedPositions)) {
      playerCardsUpdates.push(this.updatePlayerCard(false, false, true, this.playerWaiting));
    }

    this.pause();
    Promise.all(playerCardsUpdates).then(() => {
      if (this.isOver) {
        this.onGameOver(revealedTiles);
        return;
      }
      this.onRoundEnd(revealedTiles);
    });
  }

  updateStateOnTileDetonation(revealedTiles) {
    super.updateStateOnTileDetonation(revealedTiles);
    const revealedPositions = this.mineField.getTilesPositions(revealedTiles);

    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    const playerFlagsAffected = this.playerOnTurn.inTouchedTiles(revealedPositions);
    
    const playerCardsUpdates = [this.updatePlayerCard(missedTurnsUpdated, true, playerFlagsAffected)];
    
    if (this.playerTouchedTilesAffected(revealedPositions)) {
      playerCardsUpdates.push(this.updatePlayerCard(false, false, true, this.playerWaiting));
    }
    Promise.all(playerCardsUpdates).then(() => this.onGameOver(revealedTiles));
  }

  playerTouchedTilesAffected(revealedPositions, player = this.playerWaiting) {
    if (player.inTouchedTiles(revealedPositions)) {
      player.removeFromTouchedPositions = revealedPositions;
      return true;
    }

    return false;
  }








  handleTileMarking(tile) {

    if (!this.strategyAllowed) {
      this.revealMinefieldArea(tile);
      return;
    }
    // set flag
    if (this.flaggingAllowed(tile)) {
      this.updateStateOnFlaggedTile(tile);
      return;
    }
    // set mark
    if (this.markingAllowed(tile)) {
      this.updateStateOnMarkedTile(tile);
      return;
    }
    // reset
    if (this.resetingAllowed(tile)) {
      this.updateStateOnResetedTile(tile);
      return;
    }

    this.mineField.enable();
    //super.handleTileMarking(tile);
  }

  updateStateOnFlaggedTile(tile) {
    // this.pause();
    this.setFlagOnMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    // might need to check state
    this.updatePlayerCard(missedTurnsUpdated, false, true).then(() => {
      //console.log("updateStateOnFlaggedTile", "GameVSClear");
      this.onPlayerMoveEnd([tile]);
    });
  }

  updateStateOnMarkedTile(tile) {
    this.setMarkOnMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated, false, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  updateStateOnResetedTile(tile) {
    this.resetMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated, false, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
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
   // console.log("--  onPlayerMoveEnd --");
    //console.log(this);
    this.mineField.enable();
  }

  #onSneakPeek() {
    console.log("onSneakPeek");
    return;
  }

  updatePlayerCard(turnsUpdate = false, statsUpdate = false, flagsUpdate = false, player = this.playerOnTurn) {
    const updates = this.getCardUpdates(turnsUpdate, statsUpdate, flagsUpdate, player);

    if (updates.length) {
      return Promise.all(updates);
    }

    return Promise.resolve();
  }

  getCardUpdates(
    turnsUpdate = false,
    statsUpdate = false,
    flagsUpdate = false,
    player = this.playerOnTurn,
  ) {
    const updates = super.getCardUpdates(turnsUpdate);
    if (statsUpdate) {
      updates.push(this.updatePlayerGameGoalStatistics(player));
    }
    if (flagsUpdate) {
      updates.push(this.updatePlayerCardAllowedFlags(player));
    }
    return updates;
  }

  updatePlayerGameGoalStatistics(player = this.playerOnTurn) {
    const playerTargetValue = this.getPlayerTargetValue(player);
    return this.vsDashboard.updatePlayerGameGoalStatistics(
      player,
      playerTargetValue,
    );
  }



  startGameRound() {
    // TODO: ROUND STATISTICS

    if (!this.openStrategy) {
      const positionsToHide = this.playerWaiting.touchedPositions;



      if (positionsToHide.length) {
        console.log("hide opponents marks and flags");
        console.log(positionsToHide);
      }

    }





    super.startGameRound();
  
    
  }



}
