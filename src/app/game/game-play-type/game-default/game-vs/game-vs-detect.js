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

  flaggingAllowed(tile, player = this.playerOnTurn) {
    return tile.isUntouched && player.hasFlags;
  }

  resetingAllowed(tile, player = this.playerOnTurn) {
    return (
      (tile.isFlaggedBy(player.id) && !this.allowMarks) ||
      tile.isMarkedBy(player.id)
    );
  }

  handleTileMarking(tile) {
    if (this.flaggingAllowed(tile)) { // set flag
      this.updateStateOnFlaggedTile(tile);
      return;
    }

    if (this.markingAllowed(tile)) { // set mark
      this.pause();
      this.setMarkOnMinefieldTile(tile);
      this.updatePlayerAllowedFlags().then(() => {
        this.onPlayerMoveEnd([tile]);
      });
      return;
    }
  
    if (this.resetingAllowed(tile)) { // reset
      this.pause();
      this.resetMinefieldTile(tile);
      this.updatePlayerAllowedFlags().then(() => {
        this.onPlayerMoveEnd([tile]);
      });
      return;
    }

    console.log("round continue");
    console.log("NO RESET NO FLAG NO MARK");
    console.log(tile);
    this.mineField.enable();
  }

  updateStateOnRevealedTiles(revealedTiles) {
    super.updateStateOnRevealedTiles(revealedTiles);
    this.onPlayerMoveEnd(revealedTiles);
  }

  updateStateOnFlaggedTile(tile) {
    this.pause();
    this.setFlagOnMinefieldTile(tile);
    this.updatePlayerTurnsAndAllowedFlags().then(() => {
      if (this.mineField.allMinesDetected) {
        this.setGameEnd(GameEndType.Detected);
        this.onGameOver([tile]);
        return;
      }
      this.onRoundEnd([tile]);
    });
  }

  onPlayerMoveEnd(boardTiles = []) {
    this.moveTilesUpdate = boardTiles;
    this.playerOnTurn.increaseMoves();
  
    console.log("-- onPlayerMoveEnd --");

    this.resetPlayerTurnsAfterMove().then(() => {
    
      if (this.isOnline) {
        console.log("submit online move");
        console.log(this.playerOnTurn);
        return;
      }

      this.mineField.enable();
    });
  }
}
