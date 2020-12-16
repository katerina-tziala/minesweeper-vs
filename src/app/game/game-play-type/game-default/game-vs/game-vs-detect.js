"use strict";

import { GameEndType } from "GameEnums";
import { GameVS } from "./_game-vs";

export class GameVSDetect extends GameVS {
  constructor(id, params, player, opponent) {
    super(id, params, player, opponent);
  }

  get goalTargetNumber() {
    return this.levelSettings.numberOfMines;
  }

  get isDetectMinesGoal() {
    return true;
  }

  get revealingAllowed() {
    if (this.optionsSettings.tileRevealing !== undefined) {
      return this.optionsSettings.tileRevealing;
    }
    return true;
  }

  /* UPDATE GAME AFTER REVEALING TILES */
  handleTileRevealing(tile) {
    if (this.revealingAllowed) {
      this.revealMinefieldArea(tile);
    } else {
      this.updateStateOnFlaggedTile(tile);
    }
  }

  updateStateOnRevealedTiles(revealedTiles) {
    super.updateStateOnRevealedTiles(revealedTiles);

    if (this.mineField.isCleared) {
      this.updateStateOnClearedMinefield(revealedTiles);
      return;
    }

    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated).then(() => {
      this.onPlayerMoveEnd(revealedTiles);
    });
  }

  updateStateOnClearedMinefield(revealedTiles) {
    this.pause();
    const unflaggedTiles = this.mineField.getUnrevealedMines();
    unflaggedTiles.forEach((tile) => this.setFlagOnMinefieldTile(tile));
    const boardTiles = unflaggedTiles.concat(revealedTiles);
    this.updatePlayerCardGameInfoAndCheckGameOver(boardTiles);
  }

  updatePlayerCardGameInfoAndCheckGameOver(boardTiles) {
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated, true).then(() => {
      if (this.mineField.allMinesDetected) {
        this.setGameEnd(GameEndType.Detected);
        this.onGameOver(boardTiles);
        return;
      }
      this.onRoundEnd(boardTiles);
    });
  }

  /* UPDATE GAME AFTER MARKING TILES */
  flaggingAllowed(tile, player = this.playerOnTurn) {
    return player.hasFlags && this.flagOnTileAllowedByPlayer(tile);
  }

  updateStateOnFlaggedTile(tile) {
    this.pause();
    this.setFlagOnMinefieldTile(tile);
    this.updatePlayerCardGameInfoAndCheckGameOver([tile]);
  }

  updateStateOnMarkedTile(tile) {
    this.pause();
    this.setMarkOnMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  updateStateOnResetedTile(tile) {
    this.pause();
    this.resetMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  onPlayerMoveEnd(boardTiles = []) {
    this.roundTilesUpdate = boardTiles;

    console.log("-- onPlayerMoveEnd --");
    if (this.isOnline) {
      console.log("submit online move");
      console.log(this.playerOnTurn);
      return;
    }

    this.mineField.enable();
  }

  updatePlayerCard(turnsUpdate = false, flagsUpdate = false, player = this.playerOnTurn) {
    const updates = this.getCardUpdates(turnsUpdate, flagsUpdate);

    if (updates.length) {
      return Promise.all(updates);
    }

    return Promise.resolve();
  }

  getCardUpdates(turnsUpdate = false, flagsUpdate = false) {
    const updates = [];

    if (turnsUpdate) {
      updates.push(this.updatePlayerCardMissedTurns(player));
    }

    if (flagsUpdate) {
      updates.push(this.updatePlayerCardAllowedFlags(player));
      updates.push(this.updatePlayerGameGoalStatistics(player));
    }

    return updates;
  }

  getPlayerTargetValue(player) {
    return this.wrongFlagHint ? this.getPlayerDetectedMines(player) : player.goalTargetNumber;
  }

  updatePlayerGameGoalStatistics(player = this.playerOnTurn) {
    if (this.wrongFlagHint) {
      const playerTargetValue = this.getPlayerTargetValue(player);
      return this.vsDashboard.updatePlayerGameGoalStatistics(
        player,
        playerTargetValue,
      );
    }
    return Promise.resolve();
  }
}
