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

  handleTileRevealing(tile) {
    if (tile.isUntouched) {
      this.getRevealedMinefieldArea(tile).then((boardTiles) => {
        this.setPlayerStatisticsOnTileRevealing(boardTiles);
      });
    } else {
      this.mineField.enable();
    }
  }

  setPlayerStatisticsOnTileRevealing(boardTiles) {
    if (boardTiles.length > 1 || this.oneTileRevealed(boardTiles)) {
      this.playerOnTurn.revealedTiles = boardTiles.map((tile) => tile.position);
      this.setGameEnd(
        this.playerOnTurn.clearedMinefield ? GameEndType.Cleared : undefined
      );
    } else {
      this.playerOnTurn.detonatedTile = boardTiles[0].position;
      this.setGameEnd(GameEndType.DetonatedMine);
    }
    this.onPlayerMoveEnd(boardTiles);
  }

  handleTileMarking(tile) {
    if (tile.isUntouched) {// set flag
      this.setFlagOnMinefieldTile(tile);
    } else if (this.tileMarkingAllowed(tile)) { // set mark
      this.setMarkOnMinefieldTile(tile);
    } else { // reset
      this.resetMinefieldTile(tile);
    }
    this.onPlayerMoveEnd([tile]);
  }

  onPlayerMoveEnd(boardTiles = []) {
    super.onPlayerMoveEnd(boardTiles);
    this.isOver ? this.onGameOver() : this.onGameContinueAfterMove();
  }

  onGameOver() {
    this.pause();
    this.setFaceIconOnGameEnd();
    this.mineField.revealField();

    console.log("onGameOver");
    console.log(this);
    console.log("show end modal message");
  }

  onGameContinueAfterMove() {
    if (this.isParallel) {
      console.log("parallel");
      this.submitResult();

      this.pause();
    } else {
      this.startGameRound();
    }
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
