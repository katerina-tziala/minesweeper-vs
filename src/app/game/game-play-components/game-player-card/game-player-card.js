"use strict";


import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./game-player-card.constants";

import { PlayerCardState } from "./player-card-state/player-card-state";

export class GamePlayerCard {


  constructor() {


  }

  generate(player, opponent = false) {
    const playerCard = ElementGenerator.generateContainer(["game-player-card"]);

    if (opponent) {
      ElementHandler.addStyleClass(playerCard, "direction-right");
    } else {
      ElementHandler.addStyleClass(playerCard, "direction-left");
    }
    ElementHandler.addStyleClass(playerCard, "game-player-card__color-type--" + player.colorType);


    playerCard.append(this.#generatePayerInstanceSection(player, opponent));
    playerCard.append(this.#generateDetailsSection(player, opponent));
    playerCard.append(PlayerCardState.generateStateSection(player, opponent));


    return playerCard;
  }

  #generatePayerInstanceSection(player, opponent) {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__player-section"]);
    const playerIcon = this.#generatePayerIcon(player.isBot);

    console.log(player);


    const turns = ElementGenerator.generateContainer(["turns-container"]);
    for (let index = 1; index < 11; index++) {
      const turnIndicator = ElementGenerator.generateContainer(["turn-indicator", "turn-indicator--" + index]);

      turns.append(turnIndicator);
    }

    playerInstanceSection.append(turns);

    playerInstanceSection.append(playerIcon);

    return playerInstanceSection;
  }



  #generateDetailsSection(player, opponent) {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__details-section"]);
    // if (opponent) {
    //   ElementHandler.addStyleClass(playerInstanceSection, "direction-right")
    // } else {
    //   ElementHandler.addStyleClass(playerInstanceSection, "direction-left")
    // }
    //.turns-indicator




    return playerInstanceSection;
  }



  #generatePayerIcon(isBot) {
    const styles = [DOM_ELEMENT_CLASS.personIcon];
    isBot ? styles.push(DOM_ELEMENT_CLASS.botIcon) : styles.push(DOM_ELEMENT_CLASS.playerIcon);
    const playerIcon = ElementGenerator.generateContainer(styles);
    return playerIcon;
  }



}
