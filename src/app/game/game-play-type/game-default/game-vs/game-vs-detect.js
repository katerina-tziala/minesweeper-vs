"use strict";

import { GameEndType, GameSubmission } from "GameEnums";
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
  flaggingAllowed(tile) {
    return this.flagOnTileAllowedByPlayer(tile);
  }

  setFlagOnMinefieldTile(tile) {
    super.setFlagOnMinefieldTile(tile);
    this.removeFromPlayerMarkedPositions([tile]);
  }

  updateStateOnFlaggedTile(tile) {
    this.setFlagOnMinefieldTile(tile);
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

  /* UPDATE PLAYER CARD */
  //TODO: COMPLETE THE CASES
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

  updatePlayerCard(turnsUpdate, flagsUpdate) {
    const updates = this.getCardUpdates(turnsUpdate, flagsUpdate);

    if (updates.length) {
      return Promise.all(updates);
    }

    return Promise.resolve();
  }

  getCardUpdates(turnsUpdate, flagsUpdate, player = this.playerOnTurn) {
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
