"use strict";
import { clone, randomValueFromArray } from "~/_utils/utils.js";

import { GameType, GameVSMode, GameEndType } from "GameEnums";

import { Game } from "../_game";

import { GameVSDashboard } from "../../game-vs-dashboard/game-vs-dashboard";

export class GameVS extends Game {
  constructor(id, params, player, opponent) {
    super(id, params, player);
    this.opponent = opponent;
    this.players = [this.player, this.opponent];

    this.turnSettings.turnTimer = false;
    this.turnSettings.turnDuration = 5;
    this.turnSettings.missedTurnsLimit = 3;

    //     consecutiveTurns: false

    //console.log(this.turnSettings);
    console.log(this.optionsSettings);
    this.init();
    this.vsDashboard = new GameVSDashboard(!this.#isDetectMinesGoal);
  }

  // OVERRIDEN FUNCTIONS
  get gameTimerSettings() {
    const timerSettings = super.gameTimerSettings;
    if (this.#roundTimer) {
      timerSettings.step = -1;
      timerSettings.limit = 0;
      timerSettings.initialValue = this.turnSettings.turnDuration;
    }
    return timerSettings;
  }

  get playerOnTurn() {
    return this.players.find((player) => player.turn);
  }

  get detectedMines() {
    let detectedMines = 0;
    this.players.forEach((player) => (detectedMines += player.minesDetected));
    return detectedMines;
  }

  get boardActionButtons() {
    const boardActions = super.boardActionButtons;
    if (this.#sneakPeekAllowed) {
      boardActions.push(
        GameViewHelper.generateActionButton(
          ACTION_BUTTONS.sneakPeek,
          this.onSneakPeek.bind(this)
        )
      );
    }
    return boardActions;
  }

  generateView() {
    const gameContainer = super.generateView();
    const vsDashboard = this.vsDashboard.generateView(
      this.player,
      this.opponent
    );
    gameContainer.insertBefore(vsDashboard, gameContainer.firstChild);
    return gameContainer;
  }

  init() {
    this.players.forEach((player) => {
      const goalTargetNumber = this.#isDetectMinesGoal
        ? this.levelSettings.numberOfMines
        : this.levelSettings.numberOfEmptyTiles;
      player.initState(goalTargetNumber, this.#turnsLimit);
      player.turn = player.id === this.playerStartID;
    });
    this.initState();
  }

  start() {
    console.log(this.levelSettings.minesPositions);
    this.onAfterViewInit
      .then(() => {
        return this.vsDashboard.initCardsState(this.players);
      })
      .then(() => {
        this.initDashBoard();
        if (this.#roundTimer) {
          this.setGameStart();
        }
        console.log("start VS GAME");
        // console.log(this.playerOnTurn);
        // console.log("show start modal");
        this.startGameRound();
      });
  }

  startGameRound() {
    this.initMoveTiles();

    this.vsDashboard.setCardOnTurn(this.players).then(() => {
      if (this.#roundTimer) {
        this.gameTimer.start();
      }
      console.log(" start round ");
      //keep round number
      if (this.playerOnTurn.isBot) {
        console.log("onGameContinue --- BotMove");
        //this.mineField.disable();
        this.mineField.enable();
      } else {
        this.mineField.enable();
      }
    });
  }

  restart() {
    super.restart();
    this.playerStartID = randomValueFromArray(
      this.players.map((player) => player.id)
    );
    this.init();
    this.start();
  }

  handleTileRevealing(tile) {
    if (this.#revealingAllowed) {
      // detect mines
      console.log("revealing allowed");
      console.log("handleTileRevealing");
      console.log(tile);

    
       console.log(this.optionsSettings);


    } else {
      console.log("revealing not allowed");
      this.mineField.enable();
    }
  }

  handleTileMarking(tile) {
    console.log("handleTileMarking");
    console.log(tile);
    console.log(this.optionsSettings);
  }

  onRoundTimerEnd() {
    this.playerOnTurn.increaseMissedTurns();

    if (this.playerOnTurn.exceededTurnsLimit) {
      this.setGameEnd(GameEndType.ExceededTurnsLimit);
    }

    this.vsDashboard.updatePlayerMissedTurns(this.playerOnTurn).then(() => {
      if (this.isOver) {
        this.onGameOver();
        return;
      }
      this.onRoundEnd();
    });
  }

  onPlayerMoveEnd(boardTiles = []) {
    super.onPlayerMoveEnd(boardTiles);

    if (this.isOver) {
      this.onGameOver();
      return;
    }

    console.log(boardTiles);

    if (!boardTiles.length) {
      this.onRoundEnd();
      return;
    }

    console.log("onPlayerMoveEnd");
    console.log(this.playerOnTurn);
  }

  onRoundEnd() {
    if (this.isOnline) {
      console.log("submit online round end");
      console.log(this.playerOnTurn);
    } else {
      console.log("go on the next round");
      this.#switchTurns();
      this.startGameRound();
    }
  }

  onGameOver() {
    this.pause();
    this.setFaceIconOnGameEnd();
    // this.mineField.revealField();
    if (this.isOnline) {
      console.log("onGameOver online");
    }
    console.log("onGameOver");
    console.log(this);
    console.log("show end modal message");
  }

  // CLASS SPECIFIC FUNCTIONS
  get #roundTimer() {
    return this.turnSettings && this.turnSettings.turnTimer;
  }

  get #turnsLimit() {
    return this.turnSettings ? this.turnSettings.missedTurnsLimit : null;
  }

  get #isDetectMinesGoal() {
    if (
      this.optionsSettings.vsMode &&
      this.optionsSettings.vsMode === GameVSMode.Detect
    ) {
      return true;
    }
    return false;
  }

  get #revealingAllowed() {
    if (this.optionsSettings.tileRevealing !== undefined) {
      return this.optionsSettings.tileRevealing;
    }
    return true;
  }

  get #sneakPeekAllowed() {
    if (
      this.optionsSettings.sneakPeek &&
      this.optionsSettings.sneakPeekDuration
    ) {
      return true;
    }
    return false;
  }

  #switchTurns() {
    this.players.forEach((player) => player.toggleTurn());
  }

  onSneakPeek() {
    console.log("onSneakPeek");
    return;
  }
}
