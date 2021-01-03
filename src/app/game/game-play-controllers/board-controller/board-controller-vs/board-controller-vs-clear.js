"use strict";

import { StrategyController, SneakPeekStrategyController } from "GamePlayControllers";
import { BoardControllerVS } from "./_board-controller-vs";

export class BoardControllerVSClear extends BoardControllerVS {
  #SneakPeekController;
  #StrategyController;

  constructor(gameId, params, minefieldActions, onRoundTimerEnd) {
    super(gameId, params, minefieldActions, onRoundTimerEnd);
    this.#StrategyController = new StrategyController(this.optionsSettings);
    this.#setSneakPeekController();
  }

  #setSneakPeekController() {
    this.#SneakPeekController = new SneakPeekStrategyController(
      this.#onSneakPeek.bind(this),
      this.#onSneakPeekEnd.bind(this),
      this.hiddenStrategy,
      this.roundTimer,
    );
  }

  get strategyAllowed() {
    return this.#StrategyController.strategyAllowed;
  }

  get hiddenStrategy() {
    return this.#StrategyController.hiddenStrategy;
  }

  get hiddenStrategy() {
    return this.#StrategyController.hiddenStrategy;
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

  get roundUpdates() {
    const updates = super.roundUpdates;
    updates.unshift(this.#hideOpponentStrategy());
    updates.unshift(this.#updateSneakPeekToggleBasedOnRoundTimer());
    return updates;
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
    if (this.hiddenStrategy && !this.#SneakPeekController.isRunning) {
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

  revealingAllowed(tile) {
    if (this.openStrategy) {
      return true;
    }
    return super.revealingAllowed(tile);
  }

  handleTileMarking(tile) {
    if (!this.strategyAllowed) {
      this.revealMinefieldArea(tile);
      return;
    }

    super.handleTileMarking(tile);
  }

  submitTileRevealing(boardTiles, cleared = false) {
    if (this.minefieldActions.onRevealedTiles) {
      this.minefieldActions.onRevealedTiles(boardTiles, this.getTilesPositions(boardTiles), cleared);
    }
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

  setBoardOnGameOver() {
    super.setBoardOnGameOver(this.playerOnTurn);
    console.log("check double flags");
    console.log(this.playerWaiting.strategyPositions);
  }


}
