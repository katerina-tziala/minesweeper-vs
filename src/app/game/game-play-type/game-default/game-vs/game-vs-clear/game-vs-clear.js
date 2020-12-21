"use strict";
import { clone } from "~/_utils/utils.js";

import { GameEndType, GameSubmission } from "GameEnums";

import { SneakPeekSettings } from "GameModels";

// import { GameVSDashboard } from "../../game-vs-dashboard/game-vs-dashboard";

// import { VSModeDetect } from "./vs-mode-controllers/vs-mode-detect";
import {
  ACTION_BUTTONS,
  BOARD_SECTION,
  DASHBOARD_SECTION,
} from "../../_game.constants";

import { GameViewHelper } from "../../_game-view-helper";

import { GameVS } from "../_game-vs";

import { SneakPeekController } from "GamePlayControllers";

export class GameVSClear extends GameVS {
  #gameTimerSnapshot;
  #sneakPeekController;

  constructor(id, params, player, opponent) {
    super(id, params, player, opponent);
    this.#sneakPeekController = new SneakPeekController(
      this.#onSneakPeek.bind(this),
      this.#onSneakPeekEnd.bind(this),
      this.hiddenStrategy,
      this.roundTimer,
    );
    //console.log(new SneakPeekSettings());
    // this.optionsSettings.allowFlagging = true;
    //marks: true
    // wrongFlagHint: false
    // openStrategy: false
    // sneakPeek: false
    // sneakPeekDuration: 0
    // unlimitedFlags: true
    // vsMode: "clear"
  }

  get strategyAllowed() {
    if (this.optionsSettings.tileFlagging !== undefined) {
      return this.optionsSettings.tileFlagging;
    }
    return true;
  }

  get openStrategy() {
    return (
      this.strategyAllowed &&
      this.optionsSettings &&
      this.optionsSettings.openStrategy
    );
  }

  get hiddenStrategy() {
    return this.strategyAllowed ? !this.openStrategy : false;
  }

  // get #sneakPeekAllowed() {
  //   if (this.hiddenStrategy && this.#sneakPeekController.allowed) {
  //     return true;
  //   }
  //   return false;
  // }

  get boardActionButtons() {
    let boardActions = super.boardActionButtons;
    boardActions = this.#sneakPeekController.getUpdatedBoardActions(
      boardActions,
    );
    return boardActions;
  }

  get goalTargetNumber() {
    return this.levelSettings.numberOfEmptyTiles;
  }

  get detectedMines() {
    if (this.hiddenStrategy) {
      return this.getPlayerDetectedMines(this.playerOnTurn);
    }

    return super.detectedMines;
  }

  getPlayerTargetValue(player) {
    return player.revealedTiles;
  }

  revealingAllowed(tile) {
    if (this.openStrategy) {
      return true;
    }
    return super.revealingAllowed(tile);
  }

  handleTileRevealing(tile) {
    if (this.revealingAllowed(tile)) {
      this.revealMinefieldArea(tile);
      return;
    }
    this.mineField.enable();
  }

  updateStateOnRevealedTiles(revealedTiles) {
    const revealedPositions = this.mineField.getTilesPositions(revealedTiles);
    super.updateStateOnRevealedTiles(revealedTiles);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    const playerFlagsAffected = this.playerOnTurn.inStrategyPositions(
      revealedPositions,
    );

    if (this.mineField.isCleared) {
      this.setGameEnd(GameEndType.Cleared);
    }

    const playerCardsUpdates = [
      this.updatePlayerCard(missedTurnsUpdated, true, playerFlagsAffected),
    ];

    if (this.#playerStrategyAffected(revealedPositions)) {
      playerCardsUpdates.push(
        this.updatePlayerCard(false, false, true, this.playerWaiting),
      );
    }

    this.stopRoundTimer();
    Promise.all(playerCardsUpdates).then(() => {
      if (this.isOver) {
        this.updateMineCounter();
        this.onGameOver(revealedTiles);
        return;
      }
      this.onRoundEnd(revealedTiles);
    });
  }

  updateStateOnTileDetonation(revealedTiles) {
    super.updateStateOnTileDetonation(revealedTiles);
    const revealedPositions = this.mineField.getTilesPositions(revealedTiles);

    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    const playerFlagsAffected = this.playerOnTurn.inStrategyPositions(
      revealedPositions,
    );

    const playerCardsUpdates = [
      this.updatePlayerCard(missedTurnsUpdated, true, playerFlagsAffected),
    ];

    if (this.#playerStrategyAffected(revealedPositions)) {
      playerCardsUpdates.push(
        this.updatePlayerCard(false, false, true, this.playerWaiting),
      );
    }
    Promise.all(playerCardsUpdates).then(() => {
      this.updateMineCounter();
      this.onGameOver(revealedTiles);
    });
  }

  #playerStrategyAffected(revealedPositions, player = this.playerWaiting) {
    if (player.inStrategyPositions(revealedPositions)) {
      player.removeFromStrategyPositions = revealedPositions;
      return true;
    }

    return false;
  }

  handleTileMarking(tile) {
    if (!this.strategyAllowed) {
      this.revealMinefieldArea(tile);
      return;
    }
    super.handleTileMarking(tile);
  }

  updateStateOnFlaggedTile(tile) {
    this.setFlagOnMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated, false, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  updateStateOnMarkedTile(tile) {
    this.setMarkOnMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated, false, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  updateStateOnResetedTile(tile) {
    this.resetMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatePlayerCard(missedTurnsUpdated, false, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  onPlayerMoveEnd(boardTiles = []) {
    this.updateMineCounter();
    this.roundTilesUpdate = boardTiles;
    if (this.isOnline) {
      //TODO:
      console.log("--  submit online move --");
      console.log("GameVSDetect");
      console.log("----------------------------");
      this.submitResult(GameSubmission.MoveEnd);
      console.log("decide how game is continued for this player");
      this.pause();
      return;
    }
    // console.log("--  onPlayerMoveEnd --");
    //console.log(this);
    this.mineField.enable();
  }

  updatePlayerCard(
    turnsUpdate = false,
    statsUpdate = false,
    flagsUpdate = false,
    player = this.playerOnTurn,
  ) {
    const updates = this.getCardUpdates(
      turnsUpdate,
      statsUpdate,
      flagsUpdate,
      player,
    );

    if (updates.length) {
      return Promise.all(updates);
    }

    return Promise.resolve();
  }

  getCardUpdates(
    turnsUpdate = false,
    statsUpdate = false,
    flagsUpdate = false,
    player = this.playerOnTurn,
  ) {
    const updates = super.getCardUpdates(turnsUpdate);
    if (statsUpdate) {
      updates.push(this.updatePlayerGameGoalStatistics(player));
    }
    if (flagsUpdate) {
      updates.push(this.updatePlayerCardAllowedFlags(player));
    }
    return updates;
  }

  updatePlayerGameGoalStatistics(player = this.playerOnTurn) {
    const playerTargetValue = this.getPlayerTargetValue(player);
    return this.vsDashboard.updatePlayerGameGoalStatistics(
      player,
      playerTargetValue,
    );
  }

  startRoundTimer() {
    super.startRoundTimer();
    this.#sneakPeekController.updateToggleState(
      this.playerOnTurn,
      this.playerWaiting,
      this.gameTimer.value,
    );
  }

  startGameRound() {
    this.#hideOpponentStrategy().then(() => {
      this.updateMineCounter();
      super.startGameRound();
    });
  }

  #hideStrategyForPlayer(player) {
    const strategyPositions = player.strategyPositions;

    if (this.hiddenStrategy && strategyPositions.length) {
      this.mineField.hideStrategy(strategyPositions);
      return Promise.resolve();
    }

    return Promise.resolve();
  }

  #displayStrategyForPlayer(player) {
    const strategyPositions = player.strategyPositions;

    if (this.hiddenStrategy && strategyPositions.length) {
      this.mineField.showStrategy(player, this.wrongFlagHint);

      return Promise.resolve();
    }

    return Promise.resolve();
  }

  onGameOver(boardTiles = []) {
    super.onGameOver(boardTiles);

    console.log(this.playerWaiting.strategyPositions);
  }

  // when no round timer disable sneak peek button when
  //timer is not started and player has no moves

  #revealOpponentStrategy() {
    const interfaceUpdates = [];
    interfaceUpdates.push(this.#hideStrategyForPlayer(this.playerOnTurn));
    interfaceUpdates.push(this.#displayStrategyForPlayer(this.playerWaiting));
    return Promise.all(interfaceUpdates);
  }

  #hideOpponentStrategy() {
    const interfaceUpdates = [];
    interfaceUpdates.push(this.#hideStrategyForPlayer(this.playerWaiting));
    interfaceUpdates.push(this.#displayStrategyForPlayer(this.playerOnTurn));
    return Promise.all(interfaceUpdates);
  }

  #onSneakPeek() {
    const sneakPeekAllowed = this.#sneakPeekController.sneakPeekAllowed(
      this.playerOnTurn,
      this.playerWaiting,
      this.gameTimer.value,
    );

    if (!sneakPeekAllowed) {
      return;
    }

    this.#revealOpponentStrategy().then(() => {
      this.mineCounter.value = this.levelSettings.numberOfMines - this.getPlayerDetectedMines(this.playerWaiting);
      //TODO: different icon
      this.setSmileFace(this.playerWaiting.colorType);
      this.#sneakPeekController.playerPeeking(this.playerOnTurn, this.playerWaiting);
    });
  }

  #onSneakPeekEnd() {
    this.gameTimer.continue();
    this.#hideOpponentStrategy().then(() => {
      this.setSmileFace();
      this.updateMineCounter();
      this.#sneakPeekController.stopPeeking(
        this.playerOnTurn,
        this.playerWaiting,
      );
      this.mineField.enable();
    });
  }

  pause() {
    this.gameTimer.stop();
    if (this.#sneakPeekController.isRunning) {
      this.#sneakPeekController.stop();
      return;
    }
    this.mineField.disable();
  }

  continue() {
    if (this.#sneakPeekController.isPaused) {
      this.#sneakPeekController.continue();
      return;
    }
    super.continue();
  }

  start() {
    console.log(this.levelSettings.minesPositions);
    this.onAfterViewInit
      .then(() => {
        this.initDashBoard();

        this.#sneakPeekController.parentElementID = this.mineField.freezerId;

        if (this.roundTimer) {
          console.log("kkk");
          this.setGameStart();
        }

        console.log("START GameVS GAME");
        console.log("----------------------------");
        console.log(" show start modal message");
        this.startGameRound();
      });
  }
}
