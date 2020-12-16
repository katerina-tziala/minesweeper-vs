"use strict";

import { GameEndType, GameVSMode } from "GameEnums";
import { Game } from "./_game";
export class GameSinglePlayer extends Game {
  constructor(id, params, player) {
    super(id, params, player);
    this.init();
  }

  get boardActionButtons() {
    if (this.isParallel) {
      return [];
    }
    return super.boardActionButtons;
  }

  get isParallel() {
    if (
      this.optionsSettings.vsMode &&
      this.optionsSettings.vsMode === GameVSMode.Parallel
    ) {
      return true;
    }
    return false;
  }

  init() {
    this.player.initState(this.levelSettings.numberOfEmptyTiles);
    this.player.turn = true;
    this.initState();
  }

  start() {
    this.onAfterViewInit.then(() => {
      this.initDashBoard();

      // start modal
      console.log("show start modal message");
      console.log(this.levelSettings.minesPositions);
      this.startGameRound();
    });
  }

  restart() {
    super.restart();
    this.init();
    this.start();
  }

  /* UPDATE GAME AFTER MARKING TILES */
  updateStateOnTileDetonation(revealedTiles) {
    super.updateStateOnTileDetonation(revealedTiles);
    this.onGameOver(revealedTiles);
  }

  updateStateOnRevealedTiles(revealedTiles) {
    super.updateStateOnRevealedTiles(revealedTiles);
    if (this.playerOnTurn.clearedMinefield) {
      this.setGameEnd(GameEndType.Cleared);
      this.onGameOver(revealedTiles);
      return;
    }
    this.onPlayerMoveEnd(revealedTiles);
  }

  handleTileMarking(tile) {
    console.log(tile);
    if (tile.isUntouched) {
      this.updateStateOnFlaggedTile(tile);
    } else if (this.markingAllowed(tile)) {
      this.updateStateOnMarkedTile(tile);
    } else {
      this.updateStateOnResetedTile(tile);
    }
    this.mineField.enable();
  }

  updateStateOnFlaggedTile(tile) {
    this.setFlagOnMinefieldTile(tile);
    this.onPlayerMoveEnd([tile]);
  }

  updateStateOnMarkedTile(tile) {
    this.setMarkOnMinefieldTile(tile);
    this.onPlayerMoveEnd([tile]);
  }

  updateStateOnResetedTile(tile) {
    this.resetMinefieldTile(tile);
    this.onPlayerMoveEnd([tile]);
  }

  startGameRound() {
    this.initRoundTiles();

    //keep round number
    if (this.playerOnTurn.isBot) {
      console.log("get BotMove");
      //this.mineField.disable();
      this.mineField.enable();
    } else {
      this.mineField.enable();
    }
  }

  onPlayerMoveEnd(boardTiles = []) {
    this.roundTilesUpdate = boardTiles;
    if (this.isParallel) {
      console.log("parallel");
      this.submitResult();
      this.pause();
      return;
    } else {
      this.startGameRound();
    }
  }

  onGameOver(boardTiles = []) {
    super.onGameOver(boardTiles);
    if (this.isParallel) {
      console.log("parallel");
      this.submitResult();
      this.pause();
      return;
    }
    console.log("onGameOver");
    console.log(this);
    console.log("show end modal message");
  }

}
