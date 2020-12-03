"use strict";
import { AppModel } from "~/_models/app-model";
import { getRandomValueFromArray } from "~/_utils/utils";
import { GameType, GameEndType, GameVSMode } from "Game";

export class Game extends AppModel {
  #players = [];
  #roundTiles = [];

  constructor(type, params, player, opponent) {
    super();
    this.id = type;
    this.type = type;
    this.player = player;
    this.opponent = opponent;
    this.update(params);
    this.players = player;
    this.players = opponent;
    this.init();
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

  get isOver() {
    return this.gameOverType ? true : false;
  }

  set #endGame(type) {
    this.gameOverType = type;
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

  get isIdle() {
    return (!this.startedAt || this.isOver) ? true : false;
  }

  // TURN SETTINGS
  get roundTimer() {
    return this.turnSettings && this.turnSettings.turnTimer;
  }

  get roundDuration() {
    return this.turnSettings.turnDuration;
  }

  get gameTimerParams() {
    let step = 1;
    let limit = null;
    let initialValue = 0;

    if (this.roundTimer) {
      step = -1;
      limit = 0;
      initialValue = this.roundDuration;
    }

    return { step, limit, initialValue };
  }




  init() {
    this.#roundTiles = [];
    this.#setIdle();
    this.#players.forEach(player => player.initState());
    this.#setMinesPositions();
    this.#initTurns();
  }



  setGameStart() {
    this.startedAt = new Date().toISOString();
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




  get actionsAllowed() {
    return this.type !== GameType.Online;
  }

  get singlePlayer() {
    return this.#players.length === 1;
  }

  startRound() {
    this.#roundTiles = [];
    if (this.startedAt) {
      this.switchTurns();
    }
  }

  switchTurns() {
    if (!this.singlePlayer) {
      this.#players.forEach(player => player.toggleTurn());
    }
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
      this.#endGame = GameEndType.Cleared;
      if (this.singlePlayer) {
        console.log("single player completed clear goal");
        this.playerOnTurn.completedGoal = true;
      } else {

      }
    }
  }

  #setIdle() {
    this.gameOverType = null;
    this.completedAt = null;
    this.startedAt = null;
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
      playerOnTurn.inRevealedPositions = tile.position;
    });
  }

  #setPlayerStatisticsOnTileUpdate(tile, playerOnTurn = this.playerOnTurn) {
    if (tile.isDetonatedMine) {
      playerOnTurn.detonatedMine = true;
      this.#endGame = GameEndType.DetonatedMine;
    } else if (tile.isRevealed) {
      playerOnTurn.inRevealedPositions = tile.position;
    } else if (tile.isFlagged) {
      playerOnTurn.onSetFlag(tile.position, tile.isWronglyFlagged);
    } else if (tile.isMarked) {
      playerOnTurn.onSetMark(tile.position);
    } else if (tile.isUntouched) {
      playerOnTurn.onTileReset(tile.position);
    }
  }

  #setMinesToDetectAfterMove() {
    let detectedMines = 0;
    console.log(this.player);
    if (this.singlePlayer) {
       detectedMines = this.wrongFlagHint ? this.player.minesDetected : this.player.placedFlags;
    } else {
      this.#players.forEach(player => detectedMines = detectedMines + player.minesDetected);
    }
    this.minesToDetect = this.levelSettings.minesPositions.length - detectedMines;
  }

}