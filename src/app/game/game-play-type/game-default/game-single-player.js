"use strict";
import { Game } from "./_game";

import { GameEndType, GameVSMode, GameAction } from "GameEnums";
export class GameSinglePlayer extends Game {
  constructor(id, params, player) {
    super(id, params, player);
    this.init();
  }

  // OVERRIDEN FUNCTIONS
  get boardActionButtons() {
    if (this.isParallel) {
      return [];
    }
    return super.boardActionButtons;
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
    if (tile.isUntouched) { // set flag
      this.setFlagOnMinefieldTile(tile);
    } else if (this.tileMarkingAllowed(tile)) { // set mark
      this.setMarkOnMinefieldTile(tile);
    } else { // reset
      this.resetMinefieldTile(tile);
    }
    this.onPlayerMoveEnd([tile]);
  }

  onPlayerMoveEnd(boardTiles = []) {
    this.moveTilesUpdate = boardTiles;
    this.playerOnTurn.increaseMoves();
    if (this.isParallel) {
      console.log("parallel");
      this.submitResult();

      this.pause();
    } else {
      this.startGameRound();
    }
  }

  onGameOver(boardTiles = []) {
    super.onGameOver(boardTiles);
    if (this.isParallel) {
      console.log("parallel");
      this.submitResult();
      return;
    }
    console.log("onGameOver");
    console.log(this);
    console.log("show end modal message");
  }

  // CLASS SPECIFIC FUNCTIONS
  get isParallel() {
    if (
      this.optionsSettings.vsMode &&
      this.optionsSettings.vsMode === GameVSMode.Parallel
    ) {
      return true;
    }
    return false;
  }

  startGameRound() {
    this.initMoveTiles();
    if (this.playerOnTurn.isBot) {
      console.log("onGameContinue --- BotMove");
      this.mineField.disable();
    } else {
      this.mineField.enable();
    }
  }
}
