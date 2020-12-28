"use strict";
import { clone, replaceStringParameter } from "~/_utils/utils";


import { GameEndType, GameVSMode, GameSubmission } from "GameEnums";
import { GameDefault } from "../_game-default";
import { MESSAGE } from "./game-single-player.constants";

export class GameSinglePlayer extends GameDefault {
  #_minefieldInteractionAllowed = true;

  constructor(id, params, player) {
    super(id, params, player);
    this.init();
  }

  set minefieldInteractionAllowed(allowed) {
    this.#_minefieldInteractionAllowed = allowed;
  }

  get minefieldInteractionAllowed() {
    return this.#_minefieldInteractionAllowed;
  }

  get boardActionsAllowed() {
    return !this.isParallel;
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

  initPlayer() {
    if (!this.isParallel) {
      this.player.turn = true;
    }
    this.player.initState(this.levelSettings.numberOfEmptyTiles);
  }

  init() {
    this.initPlayer();
    this.initState();
  }

  //TODO: COMPLETE THE CASES
  start() {
    this.onAfterViewInit.then(() => {
      this.initDashBoard();

      if (this.startedAt) {
        this.gameTimer.start();
      }

      if (this.isParallel) {
        this.startGameRound();
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
    if (this.isParallel) {
      return;
    }
    this.setMinesPositions();
    this.init();
    this.start();
  }

  /* UPDATE GAME AFTER MARKING TILES */
  updateStateOnTileDetonation(revealedTiles) {
    super.updateStateOnTileDetonation(revealedTiles);
    this.updateMineCounter();
    this.onGameOver(revealedTiles);
  }

  updateStateOnRevealedTiles(revealedTiles) {
    super.updateStateOnRevealedTiles(revealedTiles);
    if (this.playerOnTurn.clearedMinefield) {
      this.setGameEnd(GameEndType.Cleared);
      this.updateMineCounter();
      this.onGameOver(revealedTiles);
      return;
    }
    this.onPlayerMoveEnd(revealedTiles);
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

    this.enableMinefield();
  }

  startBotRound() {
    this.initRoundTiles();
    //TODO:
    console.log("--  get Bot move -- ");
    console.log("GameSinglePlayer");
    console.log("----------------------------");
    // this.mineField.disable();
    this.enableMinefield();
  }

  onPlayerMoveEnd(boardTiles = []) {
    this.updateMineCounter();
    this.roundTilesUpdate = boardTiles;
    this.submitResult(GameSubmission.MoveEnd);
    this.startGameRound();
  }

  //TODO: COMPLETE THE CASES
  onGameOver(boardTiles = []) {
    super.onGameOver(boardTiles);

    if (this.isParallel) {
      this.#submitGameOver(GameSubmission.GameOver);
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

  get #submissionAllowed() {
    return this.isParallel && this.externalActions.onMoveSubmission;
  }

  get #updatePlayerCard() {
    return this.roundTiles.length ? this.roundTiles.some(tile => tile.isRevealed) : false;
  }

  #submitBotUpdate() {
    if (this.#updatePlayerCard) {
      this.externalActions.onMoveSubmission(this.#updatePlayerCard);
    }
  }

  get playerTargetValue() {
    return this.playerOnTurn.revealedTiles;
  }
  
  submitResult() {
    if (!this.#submissionAllowed) {
      return;
    }
    if (this.playerOnTurn.isBot) {
      this.#submitBotUpdate();
      return;
    }
    this.externalActions.onMoveSubmission(this.#updatePlayerCard, this.gameState);
  }

  #submitGameOver() {
    if (this.externalActions.onGameOverSubmission) {
      this.externalActions.onGameOverSubmission(this.gameState);
    }
  }

  continue() {
    this.gameTimer.continue();
    if (!this.playerOnTurn.isBot) {
      this.enableMinefield();
    }
  }

  enableMinefield() {
    if (this.minefieldInteractionAllowed) {
      this.mineField.enable();
    }
  }
  
}
