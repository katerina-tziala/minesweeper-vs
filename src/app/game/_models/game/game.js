"use strict";
import { AppModel } from "~/_models/app-model";
import { getRandomValueFromArray } from "~/_utils/utils";
import { GameEndType, GameVSMode } from "Game";

export class Game extends AppModel {
  #players = [];
  #playerOnTurn;
  #roundTiles = [];
  #startedAt;
  #gameOver;
  #completedAt;

  #minesToDetect;
  // #timerSeconds;

  constructor(type, params, player, opponent) {
    super();
    this.id = type;
    this.type = type;
    this.player = player;
    this.opponent = opponent;
    this.isOnline = false;
    this.update(params);
    this.players = player;
    this.players = opponent;
  }

  set players(player) {
    if (player) {
      this.#players.push(player);
    }
  }

  get players() {
    return this.#players;
  }

  get playerOnTurn() {
    return this.players.find(player => player.turn);
  }

  set roundTiles(roundTiles) {
    return this.#roundTiles = this.#roundTiles.concat(roundTiles);
  }

  get roundTiles() {
    return this.#roundTiles;
  }

  set gameOver(gameOver) {
    return this.#gameOver = gameOver;
  }

  get gameOver() {
    return this.#gameOver;
  }

  get isOver() {
    return this.#gameOver ? true : false;
  }

  set endGame(type) {
    this.gameOver = type;
    this.completedAt = new Date().toISOString();
  }

  get wrongFlagHint() {
    return this.optionsSettings.wrongFlagHint;
  }

  get allowMarks() {
    return this.optionsSettings.marks;
  }

  get vsMode() {
    return this.optionsSettings.vsMode;
  }

  set minesToDetect(minesToDetect) {
    this.#minesToDetect = minesToDetect;
  }

  get minesToDetect() {
    return this.#minesToDetect;
  }

  set completedAt(completedAt) {
    this.#completedAt = completedAt;
  }

  get completedAt() {
    return this.#completedAt;
  }

  set startedAt(startedAt) {
    this.#startedAt = startedAt;
  }

  get startedAt() {
    return this.#completedAt;
  }

  init() {
    this.#roundTiles = [];
    this.gameOver = null;
    this.completedAt = null;
    this.#setMinesPositions();
    this.#initTurns();
  }

  updateOnPlayerMove(boardTiles) {
    const playerOnTurn = this.playerOnTurn;
    playerOnTurn.increaseMoves();
    this.roundTiles = boardTiles;

    (boardTiles.length === 1)
      ? this.#setPlayerStatisticsOnTileUpdate(boardTiles[0])
      : this.#setPlayerStatisticsOnRevealedMines(boardTiles);

    this.#setMinesToDetectAfterMove();
  }





  startRound() {
    this.#roundTiles = [];

   if (this.startedAt) {
     console.log("started");
   }
    console.log("startRound");

  }


  get dashboardIconColor() {
    if (this.vsMode && this.vsMode !== GameVSMode.Parallel) {
      return this.playerOnTurn.colorType;
    }
    return undefined;
  }





  checkGameEnd(mineField) {
    if (!this.isOver) {
      this.#checkGameEndOnFieldState(mineField);
    }
  }

  // PRIVATE FUNCTIONS
  #checkGameEndOnFieldState(mineField) {
    if (this.vsMode === GameVSMode.Detect) {
      console.log("vsMode", this.vsMode);
      return;
    }
    if (mineField.isCleared) {
      this.endGame = GameEndType.Cleared;
      if (this.#players.length === 1) {
        console.log("single player completed clear goal");
        this.playerOnTurn.completedGoal = true;
      } else {

      }
    }
  }

  #setMinesPositions() {
    this.levelSettings.setMinesPositions();
    this.minesToDetect = this.levelSettings.minesPositions.length;
  }

  #initTurns() {
    const playerStartID = getRandomValueFromArray(this.players.map(player => player.id));
    this.players.find(player => player.id === playerStartID).turn = true;
  }

  #setPlayerStatisticsOnRevealedMines(boardTiles, playerOnTurn = this.playerOnTurn) {
    boardTiles.forEach(tile => {
      playerOnTurn.inRevealedPositions = tile.id;
    });
  }

  #setPlayerStatisticsOnTileUpdate(tile, playerOnTurn = this.playerOnTurn) {
    if (tile.isDetonatedMine) {
      playerOnTurn.detonatedMine = true;
      this.endGame = GameEndType.DetonatedMine;
    } else if (tile.isRevealed) {
      playerOnTurn.inRevealedPositions = tile.id;
    } else if (tile.isFlagged) {
      playerOnTurn.onSetFlag(tile.id, tile.isWronglyFlagged);
    } else if (tile.isMarked) {
      playerOnTurn.onSetMark(tile.id);
    } else if (tile.isUntouched) {
      playerOnTurn.onTileReset(tile.id);
    }
  }

  #setMinesToDetectAfterMove() {
    let detectedMines = 0;
    this.#players.forEach(player => detectedMines = detectedMines + player.minesDetected);
    this.minesToDetect = this.levelSettings.minesPositions.length - detectedMines;
  }

}