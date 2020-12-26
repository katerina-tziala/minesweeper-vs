"use strict";

import { ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS } from "./vs-dashboard-controller.constants";
import { GamePlayerCard as PlayerCard } from "GamePlayComponents";
import { BoardActionsController } from "GamePlayControllers";

export class VSDashboardController {

  constructor(online = false, clearMinefield = true, wrongFlagHint = false) {
    this.online = online;
    this.clearMinefield = clearMinefield;
    this.wrongFlagHint = wrongFlagHint;
    this.actionsController = new BoardActionsController(true, this.online);
  }

  generateView(player, opponent) {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.area,
    ]);

    const playerCard = this.#generatePlayerCard(player);
    const vsContainer = this.#generateVSContainer();
    const opponentCard = this.#generatePlayerCard(opponent, true);

    container.append(playerCard, vsContainer, opponentCard);

    return container;
  }

  // PLAYER CARD
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

  // VS CONTAINER
  #generateVSContainer() {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.vsContainer,
    ]);

    
    container.append(this.actionsController.generateView());

    return container;
  }
  //

  

  // initCardsState(players, targetValues = []) {
  //   const cardUpdates = [];
  //   players.forEach((player, index) => {
  //     cardUpdates.push(PlayerCard.updateTurnStatus(player));
  //     cardUpdates.push(PlayerCard.updateState(player));
  //     cardUpdates.push(PlayerCard.updateMissedTurns(player));
  //     if (targetValues.length) {
  //       cardUpdates.push(PlayerCard.updateGameGoalStatistics(player, targetValues[index]));
  //     }
  //   });
  //   return Promise.all(cardUpdates);
  // }

  // setCardOnTurn(players) {
  //   const cardUpdates = [];
  //   players.forEach((player) => {
  //     cardUpdates.push(PlayerCard.updateTurnStatus(player));
  //   });
  //   return Promise.all(cardUpdates);
  // }

  // updatePlayerMissedTurns(player) {
  //   return PlayerCard.updateMissedTurns(player);
  // }

  // updatePlayerAllowedFlags(player) {
  //   if (!player.unlimitedFlags) {
  //     return PlayerCard.updateAllowedFlags(player);
  //   }
  //   return Promise.resolve();
  // }

  // updatePlayerGameGoalStatistics(player, targetValue = null) {
  //   const cardUpdates = [];
  //   if (targetValue !== null) {
  //     cardUpdates.push(PlayerCard.updateGameGoalStatistics(player, targetValue));
  //   }
  //   return Promise.all(cardUpdates);
  // }
}
