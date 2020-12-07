"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./game-player-card.constants";

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

  static getPlayerCardStyles(player, opponent) {
    const cardStyles = [DOM_ELEMENT_CLASS.card];
    cardStyles.push(GamePlayerCard.getPlayerCardColorType(player));
    const cardDirection = opponent ? DOM_ELEMENT_CLASS.directionRight : DOM_ELEMENT_CLASS.directionLeft;
    cardStyles.push(cardDirection);
    if (player.turn) {
      cardStyles.push(DOM_ELEMENT_CLASS.turnOn);
    }
    return cardStyles;
  }

  static generate(player, allowedTurns, clearMinefield = true, opponent = false) {
    const cardStyles = GamePlayerCard.getPlayerCardStyles(player, opponent);
    const playerCard = ElementGenerator.generateContainer(cardStyles, GamePlayerCard.getPlayerCardID(player));
    const playerSection = GamePlayerCard.generatePlayerSection(player, allowedTurns);
    const detailsSection = PlayerCardDetails.generateDetailsSection(player, clearMinefield);
    const stateSection = PlayerCardState.generateStateSection(player);
    playerCard.append(playerSection, detailsSection, stateSection);
    return playerCard;
  }

  static generatePlayerSection(player, allowedTurns) {
    const playerInstanceSection = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.playerSection]);
    if (allowedTurns) {
      playerInstanceSection.append(TurnsIndicator.generate(player, allowedTurns));
    }
    playerInstanceSection.append(GamePlayerCard.generatePayerIcon(player.isBot));
    return playerInstanceSection;
  }

  static generatePayerIcon(isBot) {
    const styles = [DOM_ELEMENT_CLASS.personIcon];
    isBot ? styles.push(DOM_ELEMENT_CLASS.botIcon) : styles.push(DOM_ELEMENT_CLASS.playerIcon);
    //TODO: add indicator for bot level
    const playerIcon = ElementGenerator.generateContainer(styles);
    return playerIcon;
  }

  static getPlayerCard(player) {
    return ElementHandler.getByID(GamePlayerCard.getPlayerCardID(player));
  }

  // UPDATES
  static updateState(player) {
    return PlayerCardState.updateStateSection(player);
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
    return GamePlayerCard.getPlayerCard(player).then(playerCard => {
      ElementHandler.removeStyleClass(playerCard, DOM_ELEMENT_CLASS.turnOn);
      if (player.turn) {
        ElementHandler.addStyleClass(playerCard, DOM_ELEMENT_CLASS.turnOn);
      }
    });
  }

}
