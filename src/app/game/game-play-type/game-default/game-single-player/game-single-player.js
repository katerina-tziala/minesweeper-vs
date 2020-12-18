"use strict";
import { replaceStringParameter } from "~/_utils/utils";

import { GameEndType, GameVSMode, GameSubmission } from "GameEnums";
import { Game } from "../_game";

import { MESSAGE } from "./game-single-player.constants";

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
  //TODO: COMPLETE THE CASES
  start() {
    this.onAfterViewInit.then(() => {
      this.initDashBoard();

      if (this.isParallel) {
        //TODO:
        console.log("--  start parallel --");
        console.log("GameSinglePlayer");
        console.log("----------------------------");
        return;
      }
      //TODO:
      console.log("--  start original --");
      console.log("GameSinglePlayer");
      console.log("----------------------------");
      console.log(" show start modal message");
      console.log(this.startMessage);
      this.startGameRound();
    });
  }

  get startMessage() {
    const message = Object.assign(MESSAGE.gameOn);
    message.content = replaceStringParameter(
      message.content,
      this.playerOnTurn.name,
    );
    return message;
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

    if (this.playerOnTurn.isBot) {
      this.startBotRound();
      return;
    }

    this.mineField.enable();
  }
  //TODO: COMPLETE THE CASES
  startBotRound() {
    this.initRoundTiles();
    //TODO:
    console.log("--  get Bot move -- ");
    console.log("GameSinglePlayer");
    console.log("----------------------------");
     this.mineField.disable();
  }

  onPlayerMoveEnd(boardTiles = []) {
    this.roundTilesUpdate = boardTiles;

    if (this.isParallel) {
      //TODO:
      this.submitResult(GameSubmission.MoveEnd);
      //TODO:
      console.log("GameSinglePlayer PARRALLEL");
      console.log("----------------------------");
      console.log("decide how game is continued");
      this.pause();
      return;
    }

    //TODO:
    this.startGameRound();
  }

  onGameOver(boardTiles = []) {
    super.onGameOver(boardTiles);

    if (this.isParallel) {
      this.submitResult(GameSubmission.GameOver);
      return;
    }

    //TODO:
    console.log("--  game over --");
    console.log("GameSinglePlayer");
    console.log("----------------------------");
    console.log("show end modal message");
    console.log(this.playerOnTurn);
    console.log(this.endMessage);
  }

  get endMessage() {
    const message = Object.assign(
      this.playerOnTurn.lostGame ? MESSAGE.gameOverLoss : MESSAGE.gameOverWin,
    );
    message.content = replaceStringParameter(
      message.content,
      this.playerOnTurn.name,
    );
    return message;
  }
}
