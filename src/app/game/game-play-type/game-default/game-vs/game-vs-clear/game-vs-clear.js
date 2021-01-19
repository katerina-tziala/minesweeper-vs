"use strict";
import { GameOverType } from "GameEnums";

import { GameVS } from "../_game-vs";
import {
  BoardControllerVSClear as BoardController
} from "GamePlayControllers";

import { tilesPositions } from "~/game/game-play-components/mine-field/mine-field-utils";

export class GameVSClear extends GameVS {

  constructor(id, params, player, opponent) {
    super(id, params, player, opponent);
    this.#initBoardController(params);
  }

  #initBoardController(params) {
    this.gameBoardController = new BoardController(this.id,
      params,
      this.minefieldActions,
      this.onRoundTimerEnd.bind(this));
  }

  get goalTargetNumber() {
    return this.levelSettings.numberOfEmptyTiles;
  }

  get minefieldActions() {
    const actions = super.minefieldActions;
    actions.onFlaggedTile = this.onPlayerAction.bind(this);
    actions.onMarkedTile = this.onPlayerAction.bind(this);
    actions.onResetedTile = this.onPlayerAction.bind(this);
    return actions;
  }

  onTileDetonation(revealedTiles) {
    this.setGameEnd(GameOverType.DetonatedMine);
    this.updatedCards([revealedTiles[0].position]).then(() => {
      this.onGameOver(revealedTiles);
    });
  }

  onRevealedTiles(revealedTiles, cleared) {
    if (cleared) {
      this.setGameEnd(GameOverType.Cleared);
    }
    const positions = tilesPositions(revealedTiles);
    this.updatedCards(positions).then(() => {
      if (this.isOver) {
        this.onGameOver(revealedTiles);
        return;
      }
      this.onRoundEnd(revealedTiles);
    });
  }

  onPlayerAction(tile) {
    this.updatedPlayerOnTurnCardAfterAction().then(() => {
      this.onPlayerMoveEnd([tile]);
    });
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
    // this.messageController.displayTurnMessage(this.playerOnTurn).then(() => {
    //   this.onRoundPlayStart();
    // }).catch(err => {
    //   console.log(err);
    // });
  }

  /* UPDATE PLAYERS CARD */
  updatedCards(positions) {
    const playerCardsUpdates = [this.updatedPlayerOnTurnCardAfterAction(true)];

    if (this.#playerStrategyAffected(positions)) {
      playerCardsUpdates.push(
        this.updatedOpponentCard(false, true),
      );
    }

    return Promise.all(playerCardsUpdates);
  }

  updatedOpponentCard(goalUpdate = false, flagsUpdate = false) {
    const params = {
      turnsUpdate: false,
      flagsUpdate: flagsUpdate,
      goalUpdate: goalUpdate
    };
    return this.updatedPlayerCard(params, this.playerWaiting);
  }

  updatedPlayerOnTurnCardAfterAction(goalUpdate = false) {
    const missedTurnsUpdated = this.playerMissedTurnsReseted();

    const params = {
      turnsUpdate: missedTurnsUpdated,
      flagsUpdate: goalUpdate,
      goalUpdate: true
    };

    return this.updatedPlayerCard(params);
  }

}
