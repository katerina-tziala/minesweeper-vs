"use strict";
import { BoardControllerVS } from "./_board-controller-vs";

export class BoardControllerVSDetect extends BoardControllerVS {

  constructor(gameId, params, minefieldActions, onRoundTimerEnd) {
    super(gameId, params, minefieldActions, onRoundTimerEnd);
  }

  handleTileRevealing(tile) {
    if (this.revealingAllowed(tile)) {
      this.disableMinefield();
      this.revealMinefieldArea(tile);
      return;
    }

    if (this.flaggingAllowed(tile)) {
      this.disableMinefield();
      this.onFlaggedTile(tile);
      return;
    }
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
    this.mineField.flagUnrevealedMines(this.playerOnTurn).then(flaggedTiles => {
      const boardTiles = flaggedTiles.concat(revealedTiles);
      this.submitTileRevealing(boardTiles, true);
    });
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

}
