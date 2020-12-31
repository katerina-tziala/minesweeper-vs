"use strict";
import { valueDefined } from "~/_utils/validator";

import { GameOverType } from "GameEnums";
import { GameVS } from "../_game-vs";

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
    if (valueDefined(this.optionsSettings.tileRevealing)) {
      return this.optionsSettings.tileRevealing && tileRevealingAllowed;
    }
    return tileRevealingAllowed;
  }

  handleTileRevealing(tile) {
    if (!this.gameActionAllowed) {
      return;
    }

    if (this.revealingAllowed(tile)) {
      this.revealMinefieldArea(tile);
      return;
    }

    if (this.flaggingAllowed(tile)) {
      this.updateStateOnFlaggedTile(tile);
      return;
    }

    this.enableMinefield();
  }

  updateStateOnRevealedTiles(revealedTiles) {
    super.updateStateOnRevealedTiles(revealedTiles);
    this.#removeFromPlayerStrategy(revealedTiles);

    if (this.gameBoard.minefieldCleared) {
      this.updateStateOnClearedMinefield(revealedTiles);
      return;
    }

    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatedPlayerCard(missedTurnsUpdated).then(() => {
      this.onPlayerMoveEnd(revealedTiles);
    });
  }

  updateStateOnClearedMinefield(revealedTiles) {
    this.pause();
    const unflaggedTiles = this.gameBoard.unrevealedMines;
    unflaggedTiles.forEach((tile) => this.setFlagOnMinefieldTile(tile));
    const boardTiles = unflaggedTiles.concat(revealedTiles);
    this.updatePlayerCardAndCheckGameOver(boardTiles);
  }

  updateStateOnTileDetonation(revealedTiles) {
    super.updateStateOnTileDetonation(revealedTiles);
    this.#removeFromPlayerStrategy(revealedTiles);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatedPlayerCard(missedTurnsUpdated).then(() => {
      this.onGameOver(revealedTiles);
    });
  }

  updatePlayerCardAndCheckGameOver(boardTiles) {
    const missedTurnsUpdated = this.playerMissedTurnsReseted();

    if (this.gameBoard.allMinesDetected) {
      this.setGameEnd(GameOverType.Detected);
    }

    this.updatedPlayerCard(missedTurnsUpdated, true).then(() => {
      if (this.isOver) {
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
    this.updatePlayerCardAndCheckGameOver([tile]);
  }

  updateStateOnMarkedTile(tile) {
    this.setMarkOnMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();

    this.updatedPlayerCard(missedTurnsUpdated, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  updateStateOnResetedTile(tile) {
    this.resetMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatedPlayerCard(missedTurnsUpdated, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  #removeFromPlayerStrategy(revealedTiles, player = this.playerWaiting) {
    const positions = this.getTilesPositions(revealedTiles);
    player.removeFromStrategyPositions = positions;
  }

  /* UPDATE PLAYER CARD */
  updatedPlayerCard(turnsUpdate, flagsUpdate) {
    const params = {
      turnsUpdate: turnsUpdate,
      flagsUpdate: flagsUpdate,
      goalUpdate: flagsUpdate
    };
    return super.updatedPlayerCard(params);
  }

}
