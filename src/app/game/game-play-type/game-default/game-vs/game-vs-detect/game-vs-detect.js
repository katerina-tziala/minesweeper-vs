"use strict";
import { GameOverType, GameVSMode } from "GameEnums";
import { GameVS } from "../_game-vs";

import {
  BoardControllerVSDetect as BoardController
} from "GamePlayControllers";

export class GameVSDetect extends GameVS {

  constructor(id, params, player, opponent) {
    super(id, params, player, opponent);
    this.players.forEach(player => player.goal = GameVSMode.Detect);
    this.#initBoardController(params);
  }

  get goalTargetNumber() {
    return this.levelSettings.numberOfMines;
  }

  get looserOnVsMode() {
    return this.players.reduce((playerA, playerB) => {
      if (playerA.minesDetected === playerB.minesDetected) {
        return undefined;
      }
      return playerA.minesDetected < playerB.minesDetected ? playerA : playerB;
    });
  }

  get minefieldActions() {
    const actions = super.minefieldActions;
    actions.onFlaggedTile = this.onFlaggedTile.bind(this);
    actions.onMarkedTile = this.onPlayerAction.bind(this);
    actions.onResetedTile = this.onPlayerAction.bind(this);
    return actions;
  }

  #initBoardController(params) {
    this.gameBoardController = new BoardController(this.id,
      params,
      this.minefieldActions,
      this.onRoundTimerEnd.bind(this));
  }

  onTileDetonation(revealedTiles) {
    this.updatedPlayerCardAfterAction().then(() => {
      this.onGameOver(GameOverType.DetonatedMine, revealedTiles);
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
    this.updatedPlayerCardAfterAction(true).then(() => {
      if (this.gameBoard.allMinesDetected) {
        this.onGameOver(GameOverType.Detecte, boardTiles);
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
