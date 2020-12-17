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

  get openStrategy() {
    return this.optionsSettings && this.optionsSettings.openStrategy;
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

  flaggingAllowed(tile, player = this.playerOnTurn) {
    // console.log("flagOnTileAllowedByPlayer", this.flagOnTileAllowedByPlayer(tile));

    return this.flagOnTileAllowedByPlayer(tile);
  }

  revealingAllowed(tile) {
    console.log("openStrategy", this.openStrategy);

    //&& tile.isUntouched || tile.isMarked

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
    super.updateStateOnRevealedTiles(revealedTiles);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated, true).then(() => {
      if (this.mineField.isCleared) {
        this.setGameEnd(GameEndType.Cleared);
        this.onGameOver(revealedTiles);
        return;
      }
      this.onRoundEnd(revealedTiles);
    });
  }

  handleTileMarking(tile) {
    console.log("handleTileMarking", tile);

    // this.pause();

    if (!this.strategyAllowed) {
      this.revealMinefieldArea(tile);
      return;
    }

    console.log("strategyAllowed -- flags allowed", this.strategyAllowed);

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
  }

  updateStateOnFlaggedTile(tile) {
    // this.pause();
    this.setFlagOnMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    // might need to check state
    this.updatePlayerCard(missedTurnsUpdated, false, true).then(() => {
      console.log("updateStateOnFlaggedTile", "GameVSClear");
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
    //console.log(this);
    this.mineField.enable();
  }

  #onSneakPeek() {
    console.log("onSneakPeek");
    return;
  }

  updatePlayerCard(
    turnsUpdate = false,
    statsUpdate = false,
    flagsUpdate = false,
  ) {
    const updates = this.getCardUpdates(turnsUpdate, statsUpdate, flagsUpdate);

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
}
