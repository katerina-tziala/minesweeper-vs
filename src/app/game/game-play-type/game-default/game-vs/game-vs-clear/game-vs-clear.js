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
    this.updatedCards([revealedTiles[0].position]).then(() => {
      this.onGameOver(GameOverType.DetonatedMine, revealedTiles);
    });
  }

  onRevealedTiles(revealedTiles, cleared) {
    const positions = tilesPositions(revealedTiles);
    this.updatedCards(positions).then(() => {
      if (cleared) {
        this.onGameOver(GameOverType.Cleared, revealedTiles);
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
    this.messageController.displayManualTurnMessage(this.playerOnTurn).then(() => {
      this.onRoundPlayStart();
    }).catch(err => {
      console.log(err);
    });
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
