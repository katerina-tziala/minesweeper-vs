"use strict";
import { GameEndType, GameVSMode, GameSubmission } from "GameEnums";
import { GameDefault } from "../_game-default";
import { GameMessageController } from "GamePlayControllers";

export class GameSinglePlayer extends GameDefault {
  #MessageController;

  constructor(id, params, player) {
    super(id, params, player);
    this.init();
    this.#setMessageController();
  }

  #setMessageController() {
    if (!this.isParallel) {
      this.#MessageController = new GameMessageController(this.type);
    }
  }

  get #submissionAllowed() {
    return this.isParallel && this.externalActions.onMoveSubmission;
  }

  get #updatePlayerCard() {
    return this.roundTiles.length ? this.roundTiles.some(tile => tile.isRevealed) : false;
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

  get viewInitUpdates() {
    const viewUpdates = super.viewInitUpdates;
    if (this.#MessageController) {
      viewUpdates.push(this.#MessageController.hide());
    }
    return viewUpdates;
  }

  initPlayer() {
    this.player.initState(this.levelSettings.numberOfEmptyTiles);
    if (!this.isParallel) {
      this.player.turn = true;
    }
  }

  init() {
    this.initPlayer();
    this.initState();
  }

  generateView() {
    const gameContainer = super.generateView();
    if (this.#MessageController) {
      gameContainer.append(this.#MessageController.generateView());
    }
    return gameContainer;
  }

  start() {
    this.onAfterViewInit.then(() => {
      return this.#MessageController.displayStartMessage(this.playerOnTurn)
    }).then(() => {
      this.startGameRound();
    });
  }

  startParallelGamePlay() {
    if (this.startedAt) {
      this.gameBoard.startTimer();
    }
    this.startGameRound();
    return;
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

  updateStateOnFlaggedTile(tile) {
    this.setFlagOnMinefieldTile(tile);
    this.updateMinesCounter();
    this.onPlayerMoveEnd([tile]);
  }

  updateStateOnMarkedTile(tile) {
    this.setMarkOnMinefieldTile(tile);
    this.updateMinesCounter();
    this.onPlayerMoveEnd([tile]);
  }

  updateStateOnResetedTile(tile) {
    this.resetMinefieldTile(tile);
    this.updateMinesCounter();
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
    this.enableMinefield();
  }

  onPlayerMoveEnd(boardTiles = []) {
    this.roundTilesUpdate = boardTiles;
    this.submitResult(GameSubmission.MoveEnd);
    this.startGameRound();
  }

  onGameOver(boardTiles = []) {
    super.onGameOver(boardTiles);

    if (this.isParallel) {
      this.#submitGameOver(GameSubmission.GameOver);
      return;
    }

    this.#MessageController.displayEndMessage(this.playerOnTurn).then(() => {
      //TODO: ON WIN THROW CONFETTI
    });
  }

  #submitBotUpdate() {
    if (this.#updatePlayerCard) {
      this.externalActions.onMoveSubmission(this.#updatePlayerCard);
    }
  }

  #submitGameOver() {
    if (this.externalActions.onGameOverSubmission) {
      this.externalActions.onGameOverSubmission(this.gameState);
    }
  }

  continue() {
    this.continueTimer();
    this.enableMinefield();
  }

  enableMinefield() {
    if (!this.playerOnTurn.isBot && this.playerOnTurn.turn) {
      super.enableMinefield();
    }
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
}
