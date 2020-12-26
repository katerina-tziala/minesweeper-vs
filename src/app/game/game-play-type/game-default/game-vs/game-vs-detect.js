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

  /* UPDATE GAME AFTER REVEALING TILES */
  revealingAllowed(tile) {
    const tileRevealingAllowed = super.revealingAllowed(tile);
    if (this.optionsSettings.tileRevealing !== undefined) {
      return this.optionsSettings.tileRevealing && tileRevealingAllowed;
    }
    return tileRevealingAllowed;
  }

  handleTileRevealing(tile) {
    if (this.revealingAllowed(tile)) {
      this.revealMinefieldArea(tile);
      return;
    }

    if (this.flaggingAllowed(tile)) {
      this.updateStateOnFlaggedTile(tile);
      return;
    }

    this.mineField.enable();
  }

  updateStateOnRevealedTiles(revealedTiles) {
    super.updateStateOnRevealedTiles(revealedTiles);
    this.#removeFromPlayerStrategy(revealedTiles);

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

  updateStateOnTileDetonation(revealedTiles) {
    super.updateStateOnTileDetonation(revealedTiles);
    this.#removeFromPlayerStrategy(revealedTiles);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated).then(() => {
      this.updateMineCounter();
      this.onGameOver(revealedTiles);
    });
  }

  updatePlayerCardGameInfoAndCheckGameOver(boardTiles) {
    const missedTurnsUpdated = this.playerMissedTurnsReseted();

    if (this.mineField.allMinesDetected) {
      this.setGameEnd(GameEndType.Detected);
    }

    this.updatePlayerCard(missedTurnsUpdated, true).then(() => {
      if (this.isOver) {
        this.updateMineCounter();
        this.onGameOver(boardTiles);
        return;
      }
      this.onRoundEnd(boardTiles);
    });
  }

  /* UPDATE GAME AFTER MARKING TILES */
  updateStateOnFlaggedTile(tile) {
    this.setFlagOnMinefieldTile(tile);
    this.#removeFromPlayerStrategy([tile]);
    this.updatePlayerCardGameInfoAndCheckGameOver([tile]);
  }

  updateStateOnMarkedTile(tile) {
    this.setMarkOnMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();

    this.updatePlayerCard(missedTurnsUpdated, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  updateStateOnResetedTile(tile) {
    this.resetMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  #removeFromPlayerStrategy(revealedTiles, player = this.playerWaiting) {
    const positions = this.mineField.getTilesPositions(revealedTiles);
    player.removeFromStrategyPositions = positions;
  }

  /* UPDATE PLAYER CARD */
  updatePlayerCard(turnsUpdate, flagsUpdate) {
    const updates = this.getCardUpdates(turnsUpdate, flagsUpdate);

    if (updates.length) {
      return Promise.all(updates);
    }

    return Promise.resolve();
  }

  getCardUpdates(
    turnsUpdate = false,
    flagsUpdate = false,
    player = this.playerOnTurn,
  ) {
    const updates = super.getCardUpdates(turnsUpdate);

    if (flagsUpdate) {
      updates.push(this.updatePlayerCardAllowedFlags(player));
      updates.push(this.updatePlayerGameGoalStatistics(player));
    }

    return updates;
  }

  getPlayerTargetValue(player) {
    return this.wrongFlagHint
      ? this.getPlayerDetectedMines(player)
      : player.goalTargetNumber;
  }

  updatePlayerGameGoalStatistics(player = this.playerOnTurn) {
    const playerTargetValue = this.getPlayerTargetValue(player);
    return this.vsDashboard.updatePlayerGameGoalStatistics(
      player,
      playerTargetValue,
    );
  }
}
