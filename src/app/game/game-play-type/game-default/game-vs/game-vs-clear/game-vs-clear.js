"use strict";
import { GameEndType } from "GameEnums";

import { GameVS } from "../_game-vs";

import { StrategyController, SneakPeekController } from "GamePlayControllers";

export class GameVSClear extends GameVS {
  #sneakPeekController;
  #strategyController;

  constructor(id, params, player, opponent) {
    super(id, params, player, opponent);
    this.#strategyController = new StrategyController(
      this.optionsSettings,
      this.wrongFlagHint,
    );
    this.#sneakPeekController = new SneakPeekController(
      this.#onSneakPeek.bind(this),
      this.#onSneakPeekEnd.bind(this),
      this.hiddenStrategy,
      this.roundTimer,
    );
  }

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
    this.#updateSneakPeekButtonBasedOnRoundTimer();
  }

  startGameRound() {
    this.#sneakPeekController.setPlayers(this.playerOnTurn, this.playerWaiting);
    this.#hideOpponentStrategy().then(() => {
      this.updateMineCounter();
      super.startGameRound();
    });
  }

  start() {
    console.log(this.levelSettings.minesPositions);
    this.onAfterViewInit.then(() => {
      this.initDashBoard();

      this.#setSneakPeekParentElementID();

      if (this.roundTimer) {
        this.setGameStart();
        this.#setSneakPeekNotificationForRoundTimer();
      }

      console.log("START GameVS GAME");
      console.log("----------------------------");
      console.log(" show start modal message");
      this.startGameRound();
    });
  }

  onGameOver(boardTiles = []) {
    super.onGameOver(boardTiles);
    console.log(this.playerWaiting.strategyPositions);
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

  // STRATEGY
  get strategyAllowed() {
    return this.#strategyController.strategyAllowed;
  }

  get openStrategy() {
    return this.#strategyController.openStrategy;
  }

  get hiddenStrategy() {
    return this.#strategyController.hiddenStrategy;
  }

  #revealOpponentStrategy() {
    return this.#strategyController.revealOpponentStrategy(
      this.playerOnTurn,
      this.playerWaiting,
      this.mineField,
    );
  }

  #hideOpponentStrategy() {
    return this.#strategyController.hideOpponentStrategy(
      this.playerOnTurn,
      this.playerWaiting,
      this.mineField,
    );
  }

  // SNEAK PEEK
  #setSneakPeekNotificationForRoundTimer() {
    if (this.#sneakPeekController.allowed) {
      const notifyAt = this.#sneakPeekController.durationWithMargin - 1;
      this.gameTimer.setNotificationUpdate(
        this.#updateSneakPeekButtonBasedOnRoundTimer.bind(this),
        notifyAt,
      );
    }
  }

  #setSneakPeekParentElementID() {
    this.#sneakPeekController.parentElementID = this.mineField.freezerId;
  }

  get #sneakPeekAllowed() {
    return this.#sneakPeekController.sneakPeekAllowed(this.gameTimer.value);
  }

  get #playerOnTurnPeeking() {
    return this.#sneakPeekController.playerPeeking();
  }

  get #playerOnTurnStopPeeking() {
    return this.#sneakPeekController.stopPeeking(this.gameTimer.value);
  }

  #updateSneakPeekButtonBasedOnRoundTimer() {
    if (this.hiddenStrategy) {
      this.#sneakPeekController.updateToggleState(this.gameTimer.value);
    }
  }

  #peekOnOpponentStrategy() {
    const interfaceUpdates = [
      this.#revealOpponentStrategy(),
      this.#playerOnTurnPeeking,
    ];
    return Promise.all(interfaceUpdates);
  }

  #peekOnOpponentStrategyEnded() {
    const interfaceUpdates = [
      this.#hideOpponentStrategy(),
      this.#playerOnTurnStopPeeking,
    ];
    return Promise.all(interfaceUpdates);
  }

  #onSneakPeek() {
    if (!this.#sneakPeekAllowed) {
      return;
    }
    this.#peekOnOpponentStrategy()
      .then(() => {
        this.mineCounter.value = this.levelSettings.numberOfMines - this.getPlayerDetectedMines(this.playerWaiting);
        this.setRollingEyesFace(this.playerWaiting.colorType);
      })
      .catch((err) => {
        console.log(err);
        console.log("error on onSneakPeek");
      });
  }

  #onSneakPeekEnd() {
    this.gameTimer.continue();
    this.#peekOnOpponentStrategyEnded()
      .then(() => {
        this.setSmileFace();
        this.updateMineCounter();
        this.mineField.enable();
      })
      .catch((err) => {
        console.log(err);
        console.log("error on onSneakPeekEnd");
      });
  }
}
