"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";

import { AppModel } from "~/_models/app-model";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DOM_ELEMENT_CLASS } from "./game-vs-dashboard.constants";
import { GamePlayerCard as PlayerCard }  from "GamePlayComponents";

export class GameVSDashboard {

  constructor(allowedTurns, clearMinefield) {
    this.allowedTurns = allowedTurns;
    this.clearMinefield = clearMinefield;
  }

  generateView(player, opponent) {
    const playersContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container]);
    const playerCard = this.#generatePlayerCard(player);
    const opponentCard = this.#generatePlayerCard(opponent, true);
    playersContainer.append(playerCard, opponentCard);
    return playersContainer;
  }

  #generatePlayerCard(player, directionLeft = false) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.playerContainer]);
    container.append(PlayerCard.generate(player, directionLeft, this.allowedTurns, this.clearMinefield));
    return container;
  }

}
