"use strict";
import { GameOverType } from "GameEnums";
import { dateDifferenceInHoursMinutesSeconds } from "~/_utils/dates";
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
    this.gameBoard = new BoardController(this.id,
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

  #getPlayerReport(player) {
    const playerReport = player.reportData;
    if (!this.gameBoard.sneakPeeksAllowed) {
      return playerReport;
    }
    const playerSneakPeeks = this.gameBoard.sneakPeeksResults.filter(peakResult => peakResult.playerId === player.id);
    playerReport.sneakPeeks = playerSneakPeeks.length;
    if (playerReport.sneakPeeks) {
      const end = playerSneakPeeks[playerSneakPeeks.length - 1].end;
      const start = playerSneakPeeks[0].start;
      playerReport.sneakPeeksDuration = dateDifferenceInHoursMinutesSeconds(end, start);
    } else {
      playerReport.sneakPeeksDuration = {
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }
    return playerReport;
  }

  get gameResults() {
    const playersResults = [this.#getPlayerReport(this.player), this.#getPlayerReport(this.opponent)];
    return {
      gameInfo: {
        duration: this.duration,
        draw: this.isDraw,
        gameOverType: this.gameOverType,
        rounds: this.numberOfRounds,
        playerStarted: this.players.find(player => player.id === this.playerStartID).name
      },
      playersResults: playersResults,
      reportResults: ["moves", "clearedTiles", "detectedMines", "flags", "marks", "detonatedMine", "exceededTurnsLimit"]
    };
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
    this.setUpNewRound().then(() => this.onRoundPlayStart());
  }

  startGameRound() {
    if (this.isSharedDevice && this.hiddenStrategy) {
      this.#startGameRoundWithManuallStart();
      return;
    }
    super.startGameRound();
  }

  #startGameRoundWithManuallStart() {
    this.setUpNewRound().then(() => {
      return this.messageController.displayManualTurnMessage(this.playerOnTurn);
    }).then(() => {
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
