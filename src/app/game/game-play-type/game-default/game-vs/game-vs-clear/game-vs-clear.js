"use strict";
import { GameOverType } from "GameEnums";

import { GameVS } from "../_game-vs";

export class GameVSClear extends GameVS {

  constructor(id, params, player, opponent) {
    super(id, params, player, opponent);
  }

  get goalTargetNumber() {
    return this.levelSettings.numberOfEmptyTiles;
  }

  revealingAllowed(tile) {
    if (this.openStrategy) {
      return true;
    }
    return super.revealingAllowed(tile);
  }

  updateStateOnRevealedTiles(revealedTiles) {
    const revealedPositions = this.getTilesPositions(revealedTiles);
    super.updateStateOnRevealedTiles(revealedTiles);
    const missedTurnsUpdated = this.playerMissedTurnsReseted();
    const playerFlagsAffected = this.playerOnTurn.inStrategyPositions(
      revealedPositions,
    );

    if (this.gameBoard.minefieldCleared) {
      this.setGameEnd(GameOverType.Cleared);
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
    return this.gameBoard.strategyAllowed;
  }

  get openStrategy() {
    return this.gameBoard.openStrategy;
  }

  get hiddenStrategy() {
    return this.gameBoard.hiddenStrategy;
  }

  #playerStrategyAffected(revealedPositions, player = this.playerWaiting) {
    if (player.inStrategyPositions(revealedPositions)) {
      player.removeFromStrategyPositions = revealedPositions;
      return true;
    }

    return false;
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

  onGamePlayStart() {
    console.log(this.levelSettings.minesPositions);

    
    if (this.roundTimer) {
      this.setGameStart();
    }
    this.startRoundGamePlay();
  }

  startGameRound() {
    this.setUpNewRound().then(() => {
      if (this.isSharedDevice && this.hiddenStrategy) {
        this.#startGameRoundWithManuallStart();
        return;
      }
      this.onRoundPlayStart();
    });
  }

  #startGameRoundWithManuallStart() {
    this.messageController.displayTurnMessage(this.playerOnTurn).then(() => {
      this.onRoundPlayStart();
    }).catch(err => {
      console.log(err);
    });
  }

  onGameOver(boardTiles = []) {
    super.onGameOver(boardTiles);
    console.log("check double flags");
    console.log(this.playerWaiting.strategyPositions);
  }

  


}
