"use strict";


import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./game-player-card.constants";

import { PlayerCardState } from "./player-card-state/player-card-state";
import { TurnsIndicator } from "./turns-indicator/turns-indicator";
export class GamePlayerCard {


  static generate(player, allowedTurns, opponent = false) {
    const playerCard = ElementGenerator.generateContainer(["game-player-card"]);

    if (opponent) {
      ElementHandler.addStyleClass(playerCard, "direction-right");
    } else {
      ElementHandler.addStyleClass(playerCard, "direction-left");
    }
    ElementHandler.addStyleClass(playerCard, "game-player-card__color-type--" + player.colorType);


    playerCard.append(GamePlayerCard.generatePlayerSection(player, allowedTurns));
    playerCard.append(GamePlayerCard.generateDetailsSection(player, opponent));
    playerCard.append(PlayerCardState.generateStateSection(player));


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
    const playerIcon = ElementGenerator.generateContainer(styles);
    return playerIcon;
  }

  static generateDetailsSection(player, opponent) {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__details-section"]);

    const playerName = ElementGenerator.generateContainer(["game-player-card__player-name"]);
    playerName.innerHTML = player.name;
    playerInstanceSection.append(playerName);

    console.log(player);

    return playerInstanceSection;
  }

}
