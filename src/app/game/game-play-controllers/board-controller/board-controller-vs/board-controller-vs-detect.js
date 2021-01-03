"use strict";

import { valueDefined } from "~/_utils/validator";
import { BoardControllerVS } from "./_board-controller-vs";

export class BoardControllerVSDetect extends BoardControllerVS {

  constructor(gameId, params, minefieldActions, onRoundTimerEnd) {
    super(gameId, params, minefieldActions, onRoundTimerEnd);
  }

  revealingAllowed(tile) {
    const tileRevealingAllowed = super.revealingAllowed(tile);
    if (valueDefined(this.optionsSettings.tileRevealing)) {
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
      this.onFlaggedTile(tile);
      return;
    }

    this.enableMinefield();
  }

  onRevealedTiles(revealedTiles, player = this.playerOnTurn) {
    const tilesPositions = this.getTilesPositions(revealedTiles);
    player.revealedTiles = tilesPositions;
    this.#removeFromPlayerStrategy(revealedTiles);

    if (this.minefieldCleared) {
      this.updateStateOnClearedMinefield(revealedTiles);
      return;
    }

    this.submitTileRevealing(revealedTiles);
  }

  updateStateOnClearedMinefield(revealedTiles) {
    this.pause();
    const unflaggedTiles = this.unrevealedMines;
    unflaggedTiles.forEach((tile) => this.setFlagOnMinefieldTile(tile));
    const boardTiles = unflaggedTiles.concat(revealedTiles);
    this.submitTileRevealing(boardTiles, true);
  }

  submitTileRevealing(boardTiles, cleared = false) {
    if (this.minefieldActions.onRevealedTiles) {
      this.minefieldActions.onRevealedTiles(boardTiles, cleared);
    }
  }

  onTileDetonation(boardTiles) {
    this.#removeFromPlayerStrategy(boardTiles);
    super.onTileDetonation(boardTiles);
  }

  #removeFromPlayerStrategy(revealedTiles, player = this.playerWaiting) {
    const positions = this.getTilesPositions(revealedTiles);
    player.removeFromStrategyPositions = positions;
  }

  onFlaggedTile(tile) {
    this.#removeFromPlayerStrategy([tile]);
    super.onFlaggedTile(tile);
  }

  onResetedTile(tile) {
    this.resetMinefieldTile(tile);
    this.updateMinesCounter();
    if (this.minefieldActions.onResetedTile) {
      this.minefieldActions.onResetedTile(tile);
    }
  }

}
