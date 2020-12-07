"use strict";


import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DOM_ELEMENT_CLASS } from "./game-player-card.constants";

import { PlayerCardState } from "./player-card-state/player-card-state";
import { TurnsIndicator } from "./turns-indicator/turns-indicator";
import { PlayerCardDetails } from "./player-card-details/player-card-details";


export class GamePlayerCard {

  static getPlayerCardColorType(player) {
    return DOM_ELEMENT_CLASS.cardColorType + player.colorType;
  }

  static getPlayerCardStyles(player, opponent) {
    const cardStyles = [DOM_ELEMENT_CLASS.card];
    cardStyles.push(GamePlayerCard.getPlayerCardColorType(player));
    const cardDirection = opponent ? DOM_ELEMENT_CLASS.directionRight : DOM_ELEMENT_CLASS.directionLeft;
    cardStyles.push(cardDirection);
    return cardStyles;
  }

  static generate(player, allowedTurns, clearMinefield = true, opponent = false) {
    const cardStyles = GamePlayerCard.getPlayerCardStyles(player, opponent);
    const playerCard = ElementGenerator.generateContainer(cardStyles);
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


}
