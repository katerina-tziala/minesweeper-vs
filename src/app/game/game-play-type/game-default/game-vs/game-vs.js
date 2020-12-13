"use strict";
import { clone, randomValueFromArray } from "~/_utils/utils.js";

import { GameType, GameVSMode, GameEndType } from "GameEnums";

import { Game } from "../_game";

import { GameVSDashboard } from "../../game-vs-dashboard/game-vs-dashboard";

import { VSModeDetect } from "./vs-mode-controllers/vs-mode-detect";
import { VSModeClear } from "./vs-mode-controllers/vs-mode-clear";

export class GameVS extends Game {
  #modeController;

  constructor(id, params, player, opponent) {
    super(id, params, player);
    this.opponent = opponent;
    this.players = [this.player, this.opponent];

    this.#setModeController();

    //this.turnSettings.turnTimer = false;
   // this.turnSettings.consecutiveTurns = true;
    this.turnSettings.turnDuration = 5;
    this.turnSettings.missedTurnsLimit = 3;

    this.optionsSettings.unlimitedFlags = false;

    
    //console.log(this.turnSettings);
    // console.log(this.optionsSettings);
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

    console.log(this.#maxAllowedFlags);
    this.players.forEach((player) => {
     
      player.initState(this.#goalTargetNumber, this.#turnsLimit, 3);
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
    if (this.#modeController.revealingAllowed && tile.isUntouched) {
      this.pause();
      this.getRevealedMinefieldArea(tile).then((boardTiles) => {
        this.setPlayerStatisticsOnTileRevealing(boardTiles);
      });
    } else {
      this.mineField.enable();
    }
  }

  setPlayerStatisticsOnTileRevealing(boardTiles, player = this.playerOnTurn) {
    if (boardTiles.length > 1 || this.oneTileRevealed(boardTiles)) {
      player.revealedTiles = boardTiles.map((tile) => tile.position);
      this.setGameEnd(this.#modeController.getGameEndOnPlayerMove(player));
      console.log("check game over on minefield state after revealing");
      //this.onPlayerMoveEnd(boardTiles);
      this.resetPlayerTurnsAfterMove().then(() => this.onPlayerMoveEnd(boardTiles));
    } else {
      player.detonatedTile = boardTiles[0].position;
      this.setGameEnd(GameEndType.DetonatedMine);
      this.resetPlayerTurnsAfterMove().then(() => this.onPlayerMoveEnd(boardTiles));
    }
  }

  resetPlayerTurnsAfterMove(player = this.playerOnTurn) {
    if (this.turnSettings.consecutiveTurns && player.missedTurns) {
      player.resetMissedTurns();
      return this.vsDashboard.updatePlayerMissedTurns(player);
    }
    return Promise.resolve();
  }

  handleTileMarking(tile) {
    console.log("handleTileMarking detect");
    console.log(tile);
  
    this.pause();

    if (tile.isUntouched) {
      this.handleTileFlagging(tile);
    } else {
      console.log("touched tile - flagged or marked by any player");

      console.log(this.optionsSettings);
    }
  }


  handleTileFlagging(tile, player = this.playerOnTurn) {
    if (this.#modeController.getFlaggingAllowed(player)) {
      this.setFlagOnMinefieldTile(tile);
  
      console.log("check game over on minefield state after flagging");

      const playerUpdates = [this.vsDashboard.updatePlayerAllowedFlags(player)];
      playerUpdates.push(this.resetPlayerTurnsAfterMove());
      Promise.all(playerUpdates).then(() => this.onPlayerMoveEnd([tile]));

    } else { // flagging not allowed
      this.continue();
    }
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

   if (this.#modeController.roundEnded) {
    this.onRoundEnd();
    return;
   }

   this.onGameContinueAfterMove();
  }

  onGameContinueAfterMove() {
    console.log("onGameContinueAfterMove");
    if (this.isOnline) {
      console.log("submit online move");
      console.log(this.playerOnTurn);
      return;
    }
    
    console.log("continue round for player");
    this.continue();
  }


  onRoundEnd() {

    console.log("onRoundEnd");
    if (this.isOnline) {
      console.log("submit online round end");
      console.log(this.playerOnTurn);
      return;
    }
    console.log("go on the next round");
    this.#switchTurns();
    this.startGameRound();
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
  #setModeController() {
    if (this.#isDetectMinesGoal) {
      this.#modeController = new VSModeDetect(this.optionsSettings);
    } else {
      this.#modeController = new VSModeClear(this.optionsSettings);
    }
  }

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

  get #goalTargetNumber() {
    return this.#isDetectMinesGoal ? this.levelSettings.numberOfMines : this.levelSettings.numberOfEmptyTiles;
  }

  get #maxAllowedFlags() {
    return !this.optionsSettings.unlimitedFlags ? this.levelSettings.numberOfMines : null;
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
