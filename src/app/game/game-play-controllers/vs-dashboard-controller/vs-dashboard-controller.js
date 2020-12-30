"use strict";

import { ElementGenerator, ElementHandler } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS } from "./vs-dashboard-controller.constants";
import { GamePlayerCard as PlayerCard, VSBoard } from "GamePlayComponents";
import { valueDefined } from "~/_utils/validator";
export class VSDashboardController {

  constructor(wrongFlagHint = false, clearMinefield = true) {
    this.wrongFlagHint = wrongFlagHint;
    this.clearMinefield = clearMinefield;
  }

  generateView(player, opponent, boardActions) {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.area,
    ]);
    const playerCard = this.#generatePlayerCard(player);
    const vsBoard = VSBoard.generateView(player.colorType, opponent.colorType, boardActions);
    const opponentCard = this.#generatePlayerCard(opponent, true);
    container.append(playerCard, vsBoard, opponentCard);
    return container;
  }

  #generatePlayerCard(player, directionLeft = false) {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.playerContainer,
    ]);

    if (player) {
      const playerCard = PlayerCard.generate(
        player,
        directionLeft,
        this.clearMinefield,
        this.wrongFlagHint,
      );
      container.append(playerCard);
    }

    return container;
  }

  initCardsState(players) {
    const cardUpdates = [];
    players.forEach((player) => {
      const playerTargetValue = this.#getTargetValue(player);
      cardUpdates.push(PlayerCard.updateTurnStatus(player));
      cardUpdates.push(PlayerCard.updateState(player));
      cardUpdates.push(PlayerCard.updateMissedTurns(player));
      cardUpdates.push(PlayerCard.updateGameGoalStatistics(player, playerTargetValue));
    });
    return Promise.all(cardUpdates);
  }

  setCardOnTurn(players) {
    const cardUpdates = [];
    players.forEach((player) => {
      cardUpdates.push(PlayerCard.updateTurnStatus(player));
    });
    return Promise.all(cardUpdates);
  }

  addElementInDashboard(dashboardContainer, element, position = 1) {
    ElementHandler.addInChildNodes(dashboardContainer, element, position);
  }

  #getTargetValue(player) {
    if (this.clearMinefield) {
      return player.revealedTiles;
    }

    if (this.wrongFlagHint) {
      return player.minesDetected;
    }

    return player.goalTargetNumber;
  }

  updatePlayerMissedTurns(player) {
    return PlayerCard.updateMissedTurns(player);
  }

  updatePlayerAllowedFlags(player) {
    if (!player.unlimitedFlags) {
      return PlayerCard.updateAllowedFlags(player);
    }
    return Promise.resolve();
  }

  updatePlayerGameGoalStatistics(player) {
    if (this.clearMinefield) {
      return PlayerCard.updateGameGoalStatistics(player, player.revealedTiles);
    }

    if (this.wrongFlagHint) {
      return PlayerCard.updateGameGoalStatistics(player, player.minesDetected);
    }

    return Promise.resolve();
  }

  updatedPlayerCard(player, params) {
    const updates = [];

    if (params.turnsUpdate) {
      updates.push(this.updatePlayerMissedTurns(player));
    }

    if (params.flagsUpdate) {
      updates.push(this.updatePlayerAllowedFlags(player));
    }

    if (params.goalUpdate) {
      updates.push(this.updatePlayerGameGoalStatistics(player));
    }

    if (updates.length) {
      return Promise.all(updates);
    }

    return Promise.resolve();
  }

}
