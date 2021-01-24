"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
} from "./game-player-card.constants";

import { UserAvatar } from "~/components/user-avatar/user-avatar";
import { PlayerCardState } from "./player-card-state/player-card-state";
import { TurnsIndicator } from "./turns-indicator/turns-indicator";
import { PlayerCardDetails } from "./player-card-details/player-card-details";

export class GamePlayerCard {
  static getPlayerCardID(player) {
    return DOM_ELEMENT_ID.card + player.id;
  }

  static getPlayerCardColorType(player) {
    return DOM_ELEMENT_CLASS.cardColorType + player.colorType;
  }

  static getPlayerCardStyles(player, directionLeft) {
    const cardStyles = [DOM_ELEMENT_CLASS.card];
    cardStyles.push(GamePlayerCard.getPlayerCardColorType(player));
    const cardDirection = directionLeft
      ? DOM_ELEMENT_CLASS.directionRight
      : DOM_ELEMENT_CLASS.directionLeft;
    cardStyles.push(cardDirection);
    if (player.turn) {
      cardStyles.push(DOM_ELEMENT_CLASS.turnOn);
    }
    return cardStyles;
  }

  static generateCard(player, directionLeft) {
    const cardStyles = GamePlayerCard.getPlayerCardStyles(
      player,
      directionLeft,
    );
    const card = ElementGenerator.generateContainer(
      cardStyles,
      GamePlayerCard.getPlayerCardID(player),
    );
    return card;
  }

  static generate(player, directionLeft = false, wrongFlagHint = false, flaggingAllowed = false) {
    const playerCard = GamePlayerCard.generateCard(player, directionLeft);

    const playerSection = GamePlayerCard.generatePlayerSection(player);

    const detailsSection = PlayerCardDetails.generateDetailsSection(player, wrongFlagHint);
 
    const stateSection = PlayerCardState.generateStateSection(player, flaggingAllowed);

    playerCard.append(playerSection, detailsSection, stateSection);
    return playerCard;
  }

  static generatePlayerSection(player) {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.playerSection,
    ]);
    container.append(TurnsIndicator.generate(player));
    const avatar = UserAvatar.generate(player.colorType, player.isBot);
    container.append(avatar);
    return container;
  }

  static getPlayerCard(player) {
    return ElementHandler.getByID(GamePlayerCard.getPlayerCardID(player));
  }

  // UPDATES
  static updateState(player, flaggingAllowed = false) {
    return PlayerCardState.updateStateSection(player, flaggingAllowed);
  }

  static updateAllowedFlags(player) {
    return PlayerCardState.updateAllowedFlags(player);
  }

  static updateMissedTurns(player) {
    return TurnsIndicator.update(player);
  }

  static updateGameGoalStatistics(player, value = 0) {
    return PlayerCardDetails.updateGameGoalStatistics(player, value);
  }

  static updateTurnStatus(player) {
    return GamePlayerCard.getPlayerCard(player).then((playerCard) => {
      ElementHandler.removeStyleClass(playerCard, DOM_ELEMENT_CLASS.turnOn);
      if (player.turn) {
        ElementHandler.addStyleClass(playerCard, DOM_ELEMENT_CLASS.turnOn);
      }
    });
  }
}
