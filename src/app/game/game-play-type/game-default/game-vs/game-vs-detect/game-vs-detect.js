"use strict";
import { GameOverType } from "GameEnums";
import { GameVS } from "../_game-vs";

import {
  BoardControllerVSDetect as BoardController
} from "GamePlayControllers";

export class GameVSDetect extends GameVS {

  constructor(id, params, player, opponent) {
    super(id, params, player, opponent);
    this.#initBoardController(params);
  }

  get goalTargetNumber() {
    return this.levelSettings.numberOfMines;
  }

  get isDetectMinesGoal() {
    return true;
  }

  get looserOnVsMode() {
    return this.players.reduce((playerA, playerB) => {
      if (playerA.minesDetected === playerB.minesDetected) {
        return undefined;
      }
      return playerA.minesDetected < playerB.minesDetected ? playerA : playerB;
    });
  }

  #initBoardController(params) {
    this.gameBoardController = new BoardController(this.id,
      params,
      this.minefieldActions,
      this.onRoundTimerEnd.bind(this));
  }

  get minefieldActions() {
    const actions = super.minefieldActions;
    actions.onFlaggedTile = this.onFlaggedTile.bind(this);
    actions.onMarkedTile = this.onPlayerAction.bind(this);
    actions.onResetedTile = this.onPlayerAction.bind(this);
    return actions;
  }

  onTileDetonation(revealedTiles) {
    this.setGameEnd(GameOverType.DetonatedMine);
    this.updatedPlayerCardAfterAction().then(() => {
      this.onGameOver(revealedTiles);
    });
  }

  onRevealedTiles(revealedTiles, cleared) {
    if (cleared) {
      this.updatePlayerCardAndCheckGameOver(revealedTiles);
      return;
    }
    this.updatedPlayerCardAfterAction().then(() => {
      this.onPlayerMoveEnd(revealedTiles);
    });
  }

  onFlaggedTile(tile) {
    this.updatePlayerCardAndCheckGameOver([tile]);
  }

  onPlayerAction(tile) {
    this.updatedPlayerCardAfterAction(true).then(() => {
      this.onPlayerMoveEnd([tile]);
    });
  }

  updatePlayerCardAndCheckGameOver(boardTiles) {
    if (this.gameBoard.allMinesDetected) {
      this.setGameEnd(GameOverType.Detected);
    }

    this.updatedPlayerCardAfterAction(true).then(() => {
      if (this.isOver) {
        this.onGameOver(boardTiles);
        return;
      }
      this.onRoundEnd(boardTiles);
    });
  }

  /* UPDATE PLAYER CARD */
  updatedPlayerCardAfterAction(flagsUpdate) {
    const missedTurnsUpdated = this.playerMissedTurnsReseted();

    const params = {
      turnsUpdate: missedTurnsUpdated,
      flagsUpdate: flagsUpdate,
      goalUpdate: flagsUpdate
    };

    return this.updatedPlayerCard(params);
  }

}
