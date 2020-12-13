"use strict";
import { Game } from "./_game";

import { GameEndType, GameVSMode, GameAction } from "GameEnums";
export class GameSinglePlayer extends Game {
  constructor(id, params, player) {
    super(id, params, player);
    this.init();
  }

  // OVERRIDEN FUNCTIONS
  get detectedMines() {
    return this.optionsSettings.wrongFlagHint
      ? this.player.placedFlags
      : this.player.minesDetected;
  }

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
      this.mineField
        .revealMinefieldTile(tile, this.playerOnTurn.id)
        .then((boardTiles) => {
          this.setPlayerStatisticsOnTileRevealing(boardTiles);
          this.onPlayerMoveEnd(boardTiles);
        });
    } else {
      this.mineField.enable();
    }
  }

  oneTileRevealed(boardTiles) {
    return boardTiles.length == 1 && !boardTiles[0].isDetonatedMine;
  }

  setPlayerStatisticsOnTileRevealing(boardTiles) {
    if (boardTiles.length > 1 || this.oneTileRevealed(boardTiles)) {
      this.playerOnTurn.revealedTiles = boardTiles.map((tile) => tile.position);
      this.setGameEnd(
        this.player.revealedMineField ? GameEndType.Cleared : undefined
      );
    } else {
      this.playerOnTurn.detonatedTile = boardTiles[0].position;
      this.setGameEnd(GameEndType.DetonatedMine);
    }
  }

  onPlayerMoveEnd(boardTiles) {
    this.moveTilesUpdate = boardTiles;
    this.playerOnTurn.increaseMoves();
    this.isOver ? this.onGameOver() : this.onGameContinue();
  }

  handleTileMarking(tile) {
    if (tile.isUntouched) {
      // set flag
      tile.setFlag(
        this.playerOnTurn.id,
        this.playerOnTurn.colorType,
        this.wrongFlagHint
      );
      this.playerOnTurn.flaggedTile(tile.position, tile.isWronglyFlagged);
    } else if (tile.isFlagged && this.allowMarks) {
      // set mark
      tile.setMark(this.playerOnTurn.id, this.playerOnTurn.colorType);
      this.playerOnTurn.markedTile = tile.position;
    } else {
      // reset
      tile.resetState();
      this.playerOnTurn.resetedTile = tile.position;
    }
    this.updateMineCounter();
    this.onPlayerMoveEnd([tile]);
  }

  onGameOver() {
    this.pause();
    this.setFaceIconOnGameEnd();
    console.log("onGameOver");
    console.log(this);
    // this.gameTimer.stop();
    // this.mineField.enable();
    console.log("show end modal message");
  }

  onGameContinue() {
    console.log("onGameContinue");
    if (this.isParallel) {
      this.submitMove();
    }

    if (this.playerOnTurn.isBot) {
      console.log("onGameContinue --- BotMove");
    }

    this.mineField.enable();
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
    this.initRoundTiles();
    this.mineField.enable();
    if (this.playerOnTurn.isBot) {
      console.log("onGame start --- BotMove");
    }
  }
}
