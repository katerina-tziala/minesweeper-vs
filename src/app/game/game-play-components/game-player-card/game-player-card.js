"use strict";


import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";



export class GamePlayerCard {


  constructor() {


  }

  generate(player, opponent = false) {
    const playerCard = ElementGenerator.generateContainer(["game-player-card"]);



    playerCard.append(this.#generatePayerInstanceSection(player, opponent));
    playerCard.append(this.#generateDetailsSection(player, opponent));
    playerCard.append(this.#generateFlagSection(player, opponent));


    return playerCard;
  }

  #generatePayerInstanceSection(player, opponent) {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__player-instance"]);
    if (opponent) {
      ElementHandler.addStyleClass(playerInstanceSection, "direction-right")
    } else {
      ElementHandler.addStyleClass(playerInstanceSection, "direction-left")
    }





    return playerInstanceSection;
  }

  #generateDetailsSection(player, opponent) {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__details-section"]);
    if (opponent) {
      ElementHandler.addStyleClass(playerInstanceSection, "direction-right")
    } else {
      ElementHandler.addStyleClass(playerInstanceSection, "direction-left")
    }





    return playerInstanceSection;
  }

  #generateFlagSection(player, opponent) {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__flag-section"]);
    if (opponent) {
      ElementHandler.addStyleClass(playerInstanceSection, "direction-right")
    } else {
      ElementHandler.addStyleClass(playerInstanceSection, "direction-left")
    }







    return playerInstanceSection;
  }
}
