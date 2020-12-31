"use strict";
import { GameEndType } from "GameEnums";

import { GameVS } from "../_game-vs";

import { StrategyController, SneakPeekStrategyController } from "GamePlayControllers";

export class GameVSClear extends GameVS {
  #sneakPeekController;
  #strategyController;

  constructor(id, params, player, opponent) {
    super(id, params, player, opponent);
    this.#setStrategyController();
    this.#setSneakPeekController();
  }

  get goalTargetNumber() {
    return this.levelSettings.numberOfEmptyTiles;
  }

  #setStrategyController() {
    this.#strategyController = new StrategyController(
      this.optionsSettings,
      this.wrongFlagHint,
    );
  }

  #setSneakPeekController() {
    this.#sneakPeekController = new SneakPeekStrategyController(
      this.#onSneakPeek.bind(this),
      this.#onSneakPeekEnd.bind(this),
      this.hiddenStrategy,
      this.roundTimer,
    );
  }

  get boardActions() {
    const boardActions = super.boardActions;
    const sneakPeekToggle = this.#sneakPeekController.toggleButton;
    if (sneakPeekToggle) {
      boardActions.append(sneakPeekToggle);
    }
    return boardActions;
  }

  get roundViewUpdates() {
    const viewUpdates = super.roundViewUpdates;
    viewUpdates.push(this.#hideOpponentStrategy());
    viewUpdates.push(this.#updateSneakPeekButtonBasedOnRoundTimer());
    return viewUpdates;
  }

  revealingAllowed(tile) {
    if (this.openStrategy) {
      return true;
    }
    return super.revealingAllowed(tile);
  }

  handleTileRevealing(tile) {
    if (!this.gameActionAllowed) {
      return;
    }

    if (this.revealingAllowed(tile)) {
      this.revealMinefieldArea(tile);
      return;
    }
    this.enableMinefield();
  }

  updateStateOnRevealedTiles(revealedTiles) {
    const revealedPositions = this.getTilesPositions(revealedTiles);
    super.updateStateOnRevealedTiles(revealedTiles);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    const playerFlagsAffected = this.playerOnTurn.inStrategyPositions(
      revealedPositions,
    );

    if (this.gameBoard.minefieldCleared) {
      this.setGameEnd(GameEndType.Cleared);
    }

    const playerCardsUpdates = [
      this.updatedPlayerCard(missedTurnsUpdated, true, playerFlagsAffected),
    ];

    if (this.#playerStrategyAffected(revealedPositions)) {
      playerCardsUpdates.push(
        this.updatedPlayerCard(false, false, true, this.playerWaiting),
      );
    }

    Promise.all(playerCardsUpdates).then(() => {
      if (this.isOver) {
        this.onGameOver(revealedTiles);
        return;
      }
      this.onRoundEnd(revealedTiles);
    });
  }

  updateStateOnTileDetonation(revealedTiles) {
    super.updateStateOnTileDetonation(revealedTiles);
    const revealedPositions = this.getTilesPositions(revealedTiles);

    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    const playerFlagsAffected = this.playerOnTurn.inStrategyPositions(
      revealedPositions,
    );

    const playerCardsUpdates = [
      this.updatedPlayerCard(missedTurnsUpdated, true, playerFlagsAffected),
    ];

    if (this.#playerStrategyAffected(revealedPositions)) {
      playerCardsUpdates.push(
        this.updatedPlayerCard(false, false, true, this.playerWaiting),
      );
    }
    Promise.all(playerCardsUpdates).then(() => {
      this.onGameOver(revealedTiles);
    });
  }

  handleTileMarking(tile) {
    if (!this.gameActionAllowed) {
      return;
    }
    if (!this.strategyAllowed) {
      this.revealMinefieldArea(tile);
      return;
    }
    super.handleTileMarking(tile);
  }

  updateStateOnFlaggedTile(tile) {
    this.setFlagOnMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatedPlayerCard(missedTurnsUpdated, false, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  updateStateOnMarkedTile(tile) {
    this.setMarkOnMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatedPlayerCard(missedTurnsUpdated, false, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  updateStateOnResetedTile(tile) {
    this.resetMinefieldTile(tile);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    this.updatedPlayerCard(missedTurnsUpdated, false, true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
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

  #playerStrategyAffected(revealedPositions, player = this.playerWaiting) {
    if (player.inStrategyPositions(revealedPositions)) {
      player.removeFromStrategyPositions = revealedPositions;
      return true;
    }

    return false;
  }

  #revealOpponentStrategy() {
    return this.#strategyController.revealOpponentStrategy(
      this.playerOnTurn,
      this.playerWaiting,
      this.gameBoard.mineField,
    );
  }

  #hideOpponentStrategy() {
    return this.#strategyController.hideOpponentStrategy(
      this.playerOnTurn,
      this.playerWaiting,
      this.gameBoard.mineField,
    );
  }

  // SNEAK PEEK
  #setSneakPeekNotificationForRoundTimer() {
    if (this.#sneakPeekController.allowed) {
      const notifyAt = this.#sneakPeekController.durationWithMargin - 1;
      this.gameBoard.setNotificationUpdate(
        this.#updateSneakPeekButtonBasedOnRoundTimer.bind(this),
        notifyAt,
      );
    }
  }

  #setSneakPeekParentElementID() {
    this.#sneakPeekController.parentElementID = this.gameBoard.freezerId;
  }

  get #sneakPeekAllowed() {
    return this.#sneakPeekController.sneakPeekAllowed(this.gameBoard.timerValue);
  }

  get #playerOnTurnPeeking() {
    return this.#sneakPeekController.playerPeeking();
  }

  get #playerOnTurnStopPeeking() {
    return this.#sneakPeekController.stopPeeking(this.gameBoard.timerValue);
  }

  #updateSneakPeekButtonBasedOnRoundTimer() {
    if (this.hiddenStrategy) {
      return this.#sneakPeekController.updateToggleState(this.gameBoard.timerValue);
    }
    return Promise.resolve();
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
        this.gameBoard.setDashboardOnSneakPeek(this.playerWaiting.colorType);
      })
      .catch((err) => {
        console.log(err);
        console.log("error on onSneakPeek");
      });
  }

  #onSneakPeekEnd() {
    this.continueTimer();
    this.#peekOnOpponentStrategyEnded()
      .then(() => {
        this.gameBoard.setDashboardAfterSneakPeek();
      })
      .catch((err) => {
        console.log(err);
        console.log("error on onSneakPeekEnd");
      });
  }

  /* UPDATE PLAYER CARD */
  updatedPlayerCard(turnsUpdate = false, goalUpdate = false, flagsUpdate = false) {
    const params = {
      turnsUpdate: turnsUpdate,
      flagsUpdate: flagsUpdate,
      goalUpdate: goalUpdate
    };
    return super.updatedPlayerCard(params);
  }

  initRound() {
    super.initRound();
    this.#sneakPeekController.setPlayers(this.playerOnTurn, this.playerWaiting);
  }


  onGamePlayStart() {
    console.log(this.levelSettings.minesPositions);
    this.#setSneakPeekParentElementID();

    if (this.roundTimer) {
      this.setGameStart();
      this.#setSneakPeekNotificationForRoundTimer();
    }
    console.log("START GameVS GAME");
    console.log("----------------------------");
    console.log(" show start modal message");
    this.startGameRound();

  }




  onGameOver(boardTiles = []) {
    super.onGameOver(boardTiles);


    console.log("check double flags");
    console.log(this.playerWaiting.strategyPositions);
  }

  pause() {
    this.stopTimer();
    if (this.#sneakPeekController.isRunning) {
      this.#sneakPeekController.stop();
      return;
    }
    this.disableMinefield();
  }

  continue() {
    if (this.#sneakPeekController.isPaused) {
      this.#sneakPeekController.continue();
      return;
    }
    super.continue();
  }

}
