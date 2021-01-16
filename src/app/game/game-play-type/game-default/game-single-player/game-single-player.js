"use strict";
import { GameOverType, GameVSMode, GameSubmission } from "GameEnums";
import { GameDefault } from "../_game-default";
import {
  BoardController,
  GameMessageController
} from "GamePlayControllers";

export class GameSinglePlayer extends GameDefault {
  #MessageController;

  constructor(id, params, player) {
    super(id, params, player);
    this.init();
    this.#setBoardController(params);
    this.#setMessageController();
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

  get minefieldActions() {
    const actions = super.minefieldActions;
    actions.onFlaggedTile = this.onPlayerMoveEnd.bind(this);
    actions.onMarkedTile = this.onPlayerMoveEnd.bind(this);
    actions.onResetedTile = this.onPlayerMoveEnd.bind(this);
    return actions;
  }

  get viewInitUpdates() {
    const viewUpdates = super.viewInitUpdates;
    if (this.#MessageController) {
      viewUpdates.push(this.#MessageController.hide());
    }
    return viewUpdates;
  }

  get #submissionAllowed() {
    return this.isParallel && this.externalActions.onMoveSubmission;
  }

  get #updatePlayerCard() {
    return this.roundTiles.length ? this.roundTiles.some(tile => tile.isRevealed) : false;
  }

  #setBoardController(params) {
    this.gameBoardController = new BoardController(this.id,
      params,
      this.minefieldActions,
      this.onRoundTimerEnd.bind(this));
  }

  #setMessageController() {
    if (!this.isParallel) {
      this.#MessageController = new GameMessageController();
    }
  }

  onTileDetonation(boardTiles) {
    this.setGameEnd(GameOverType.DetonatedMine);
    this.onGameOver(boardTiles);
  }

  onRevealedTiles(boardTiles) {
    if (this.playerOnTurn.clearedMinefield) {
      this.setGameEnd(GameOverType.Cleared);
      this.onGameOver(boardTiles);
      return;
    }
    this.onPlayerMoveEnd(boardTiles);
  }

  initPlayer(playerTurn = true) {
    this.player.initState(this.levelSettings.numberOfEmptyTiles);
    this.player.turn = playerTurn;
  }

  init(playerTurn = true) {
    this.initPlayer(playerTurn);
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
      return this.#MessageController.displayStartMessage(this.player);
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

  startGameRound() {
    this.initRoundStatistics();
    this.gameBoard.playerOnTurn = this.player;
    if (this.playerOnTurn.isBot) {
      this.submitBotMove();
      return;
    }
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
