"use strict";


import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./game-player-card.constants";

import { PlayerCardState } from "./player-card-state/player-card-state";
import { TurnsIndicator } from "./turns-indicator/turns-indicator";
export class GamePlayerCard {


  constructor() {


  }

  generate(player, allowedTurns, opponent = false) {
    const playerCard = ElementGenerator.generateContainer(["game-player-card"]);

    if (opponent) {
      ElementHandler.addStyleClass(playerCard, "direction-right");
    } else {
      ElementHandler.addStyleClass(playerCard, "direction-left");
    }
    ElementHandler.addStyleClass(playerCard, "game-player-card__color-type--" + player.colorType);


    playerCard.append(this.#generatePayerInstanceSection(player, allowedTurns));
    playerCard.append(this.#generateDetailsSection(player, opponent));
    playerCard.append(PlayerCardState.generateStateSection(player));


    return playerCard;
  }

  #generatePayerInstanceSection(player, allowedTurns) {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__player-section"]);
    if (allowedTurns) {
      playerInstanceSection.append(TurnsIndicator.generate(player, allowedTurns));
    }

    // const secondRing = ElementGenerator.generateContainer(["game-player-card__player-section--second-ring"]);
    // playerInstanceSection.append(secondRing);
    playerInstanceSection.append(this.#generatePayerIcon(player.isBot));

    console.log(player, allowedTurns);

    return playerInstanceSection;
  }



  #generateDetailsSection(player, opponent) {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__details-section"]);



    return playerInstanceSection;
  }



  #generatePayerIcon(isBot) {
    const styles = [DOM_ELEMENT_CLASS.personIcon];
    isBot ? styles.push(DOM_ELEMENT_CLASS.botIcon) : styles.push(DOM_ELEMENT_CLASS.playerIcon);
    const playerIcon = ElementGenerator.generateContainer(styles);
    return playerIcon;
  }



}
