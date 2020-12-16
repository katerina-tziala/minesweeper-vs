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


  handleTileRevealing(tile) {
    if (this.revealingAllowed) {
      this.revealMinefieldArea(tile);
    } else {
      this.updateStateOnFlaggedTile(tile);
    }
  }


  flaggingAllowed(tile, player = this.playerOnTurn) {
    return (player.hasFlags && this.flagOnTileAllowedByPlayer(tile));
  }

  updateStateOnRevealedTiles(revealedTiles) {
    super.updateStateOnRevealedTiles(revealedTiles);

    if (this.mineField.isCleared) {
      this.updateStateOnClearedMinefield(revealedTiles);
      return;
    }
  
    this.onPlayerMoveEnd(revealedTiles);
  }

  updateStateOnClearedMinefield(revealedTiles) {
    this.pause();
    const unflaggedTiles = this.mineField.getUnrevealedMines();
    unflaggedTiles.forEach(tile => this.setFlagOnMinefieldTile(tile));
    this.updatePlayerCardGameInfoAndCheckGameOver(unflaggedTiles.concat(revealedTiles));
  }

  updatePlayerCardGameInfoAndCheckGameOver(boardTiles) {
    this.updatePlayerCardGameInfo().then(() => {
      if (this.mineField.allMinesDetected) {
        this.setGameEnd(GameEndType.Detected);
        this.onGameOver(boardTiles);
        return;
      }
      this.onRoundEnd(boardTiles);
    });
  }
  


  updateStateOnFlaggedTile(tile) {
    this.pause();
    this.setFlagOnMinefieldTile(tile);
    this.updatePlayerCardGameInfoAndCheckGameOver([tile]);
  }










  updateStateOnMarkedTile(tile) {
   // this.pause();
    this.setMarkOnMinefieldTile(tile);
   // this.updatePlayerAllowedFlags().then(() => {
      this.onPlayerMoveEnd([tile]);
   // });
  }

  updateStateOnResetedTile(tile) {
   // this.pause();
    this.resetMinefieldTile(tile);
    //this.updatePlayerAllowedFlags().then(() => {
      this.onPlayerMoveEnd([tile]);
   // });
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
