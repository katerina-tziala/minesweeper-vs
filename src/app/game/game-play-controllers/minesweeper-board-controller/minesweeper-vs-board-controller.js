"use strict";
import {
  DigitalCounter,
  DashboardFaceIcon,
  MineField,
  MinefieldFreezer,
  MinesweeperBoard,
  Dashboard
} from "GamePlayComponents";

import { GameAction } from "GameEnums";
// import { GameTimer, StrategyController } from "GamePlayControllers";
// import { MinesweeperBoardController } from "./minesweeper-board-controller";
import { MinesweeperBoardController, StrategyController, SneakPeekStrategyController } from "GamePlayControllers";

export class MinesweeperVSBoardController extends MinesweeperBoardController {
  #playerWaiting;
  #SneakPeekController;
  #StrategyController;

  constructor(gameId, params, boardUpdatesHandlers, onRoundTimerEnd) {
    super(gameId, params, boardUpdatesHandlers, onRoundTimerEnd)
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
    interfaceUpdates.push(this.#displayStrategyForPlayer(this.#playerWaiting));
    return Promise.all(interfaceUpdates);
  }

  #hideOpponentStrategy() {
    const interfaceUpdates = [];
    interfaceUpdates.push(this.#hideStrategyForPlayer(this.#playerWaiting));
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
    this.playerOnTurn = playerOnTurn;
    this.#playerWaiting = playerWaiting;
    this.faceColorType = playerOnTurn.colorType;
    this.#SneakPeekController.setPlayers(playerOnTurn, playerWaiting);

    const updates = [
      this.#hideOpponentStrategy(),
      this.#updateSneakPeekToggleBasedOnRoundTimer(),
      this.setSmileFace()
    ];

    return Promise.all(updates).then(() => {
      this.updateMinesCounter();
      return;
    });

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
        return this.setRollingEyesFace(this.#playerWaiting.colorType);
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

  setBoardOnRoundEnd() {
    this.updateMinesCounter();
    if (this.roundTimer) {
      this.pause();
    }
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

}
