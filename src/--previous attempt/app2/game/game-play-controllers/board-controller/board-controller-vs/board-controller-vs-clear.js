"use strict";

import { StrategyController, SneakPeekStrategyController } from "GamePlayControllers";
import { BoardControllerVS } from "./_board-controller-vs";
import { SneakPeekSettings } from "GameModels";
export class BoardControllerVSClear extends BoardControllerVS {
  #SneakPeekController;
  #StrategyController;

  constructor(gameId, params, minefieldActions, onRoundTimerEnd) {
    super(gameId, params, minefieldActions, onRoundTimerEnd);
    this.#StrategyController = new StrategyController(this.optionsSettings);
    this.#setSneakPeekController();
  }

  #setSneakPeekController() {
    const sneakPeekSettings = new SneakPeekSettings();
    sneakPeekSettings.update(this.optionsSettings.sneakPeekSettings);
    this.#SneakPeekController = new SneakPeekStrategyController(
      sneakPeekSettings,
      this.#onSneakPeek.bind(this),
      this.#onSneakPeekEnd.bind(this),
      this.roundTimer,
    );
  }

  get strategyAllowed() {
    return this.#StrategyController.strategyAllowed;
  }

  get openStrategy() {
    return this.#StrategyController.openStrategy;
  }

  get hiddenStrategy() {
    return this.#StrategyController.hiddenStrategy;
  }

  get roundUpdates() {
    const updates = super.roundUpdates;
    updates.unshift(this.#SneakPeekController.updateToggleState(this.gameTimer.initialValue));
    if (this.hiddenStrategy) {
      updates.unshift(this.#hideOpponentStrategy());
    }
    return updates;
  }

  get sneakPeeksResults() {
    return this.#SneakPeekController.results;
  }
  
  get sneakPeeksAllowed() {
    return this.#SneakPeekController.allowed;
  }

  get #sneakPeekAllowed() {
    return this.#SneakPeekController.sneakPeekAllowed(this.timerValue);
  }

  #hideStrategyForPlayer(player) {
    if (this.#StrategyController.playerHasStrategy(player)) {
      this.mineField.hideStrategy(player);
      return Promise.resolve();
    }

    return Promise.resolve();
  }

  #displayStrategyForPlayer(player) {
    if (this.#StrategyController.playerHasStrategy(player)) {
      this.mineField.showStrategy(player, this.wrongFlagHint);
      return Promise.resolve();
    }

    return Promise.resolve();
  }

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

  generateView(actionsContainer) {
    const sneakPeekToggle = this.#SneakPeekController.toggleButton;
    if (sneakPeekToggle) {
      actionsContainer.append(sneakPeekToggle);
    }
    if (this.roundTimer) {
      this.#setSneakPeekNotificationForRoundTimer();
    }
    return super.generateView(actionsContainer);
  }

  initView() {
    this.#SneakPeekController.parentElementID = this.freezerId;
    this.#SneakPeekController.initPeekToggle();
    return super.initView();
  }

  initBoardOnRound(playerOnTurn, playerWaiting) {
    this.#SneakPeekController.setPlayers(playerOnTurn, playerWaiting);
    super.initBoardOnRound(playerOnTurn, playerWaiting);
  }

  #setSneakPeekNotificationForRoundTimer() {
    if (this.#SneakPeekController.allowed) {
      const notifyAt = this.#SneakPeekController.durationWithMargin - 1;
      this.gameTimer.setNotificationUpdate(
        this.#updateSneakPeekToggleBasedOnRoundTimer.bind(this),
        notifyAt
      );
    }
  }

  #updateSneakPeekToggleBasedOnRoundTimer() {
    if (this.roundTimer && this.hiddenStrategy && !this.#SneakPeekController.isRunning) {
      return this.#SneakPeekController.updateToggleState(this.timerValue);
    }
    return Promise.resolve();
  }

  #onSneakPeek() {
    if (!this.#sneakPeekAllowed) {
      return;
    }
    this.#revealOpponentStrategy()
      .then(() => {
        return this.#SneakPeekController.playerPeeking();
      }).then(() => {
        return this.setRollingEyesFace(this.playerWaiting.colorType);
      }).then(() => {
        this.updateMinesCounter();
      });
  }

  #onSneakPeekEnd() {
    this.continueTimer();
    this.#hideOpponentStrategy()
      .then(() => {
        return this.#SneakPeekController.stopPeeking(this.timerValue);
      })
      .then(() => {
        return this.setSmileFace();
      })
      .then(() => {
        this.updateMinesCounter();
        this.enableMinefield();
      });
  }

  pause() {
    this.stopTimer();
    if (this.#SneakPeekController.isRunning) {
      this.#SneakPeekController.stop();
      return;
    }
    this.disableMinefield();
  }

  continue() {
    if (this.#SneakPeekController.isPaused) {
      this.#SneakPeekController.continue();
      return;
    }
    super.continue();
  }

  revealingAllowed(tile, player = this.playerOnTurn) {
    if (this.mineField.tileFlaggedByOpponent(tile, player)) {
      return true;
    }
    return super.revealingAllowed(tile);
  }

  handleTileMarking(tile) {
    if (!this.strategyAllowed) {
      this.disableMinefield();
      this.revealMinefieldArea(tile);
      return;
    }
    super.handleTileMarking(tile);
  }

  onRevealedTiles(revealedTiles, player = this.playerOnTurn) {
    const tilesPositions = this.getTilesPositions(revealedTiles);
    player.revealedTiles = tilesPositions;

    if (this.minefieldCleared) {
      this.pause();
      this.submitTileRevealing(revealedTiles, true);
      return;
    }

    this.submitTileRevealing(revealedTiles);
  }

  setBoardOnGameOver(isDraw) {
    if (!this.openStrategy) {
      this.mineField.revealWithAdditionalStrategy(this.playerWaiting, this.wrongFlagHint).then(() => {
        this.setDashboardoardOnGameOver(isDraw);
      });
      return;
    }

    if (this.sneakPeeksAllowed) {
      this.#SneakPeekController.disable();
    }

    super.setBoardOnGameOver(isDraw);
  }

}
