"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";

import { AppModel } from "~/_models/app-model";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DOM_ELEMENT_CLASS } from "./game-vs-dashboard.constants";
import { GamePlayerCard as PlayerCard } from "GamePlayComponents";

export class GameVSDashboard {

  constructor(clearMinefield) {
    this.clearMinefield = clearMinefield;
  }

  generateView(player, opponent) {
    const playersContainer = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.container,
    ]);
    const playerCard = this.#generatePlayerCard(player);
    const opponentCard = this.#generatePlayerCard(opponent, true);
    playersContainer.append(playerCard, opponentCard);
    return playersContainer;
  }

  #generatePlayerCard(player, directionLeft = false) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.playerContainer]);
    const playerCard = PlayerCard.generate( player, directionLeft, this.clearMinefield);
    container.append(playerCard);
    return container;
  }

  initCardsState(players) {
    const cardUpdates = [];
    players.forEach(player => {
      const playerGameStatistics = this.clearMinefield ? player.revealedTiles : player.minesDetected;
      cardUpdates.push(PlayerCard.updateTurnStatus(player));
      cardUpdates.push(PlayerCard.updateState(player));
      cardUpdates.push(PlayerCard.updateMissedTurns(player));
      cardUpdates.push(PlayerCard.updateGameGoalStatistics(player, playerGameStatistics));
    });
    return Promise.all(cardUpdates);
  }

  setCardOnTurn(players) {
    const cardUpdates = [];
    players.forEach(player => {
      const playerGameStatistics = this.clearMinefield ? player.revealedTiles : player.minesDetected;
      cardUpdates.push(PlayerCard.updateTurnStatus(player));
    });
    return Promise.all(cardUpdates);
  }

  updatePlayerMissedTurns(player) {
    return PlayerCard.updateMissedTurns(player);
  }

  updatePlayerAllowedFlags(player) {
    return PlayerCard.updateAllowedFlags(player);
  }

}
