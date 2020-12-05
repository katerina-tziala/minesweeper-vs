"use strict";


import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";



export class GamePlayerCard {


  constructor() {


  }

  generate() {
    const playerCard = ElementGenerator.generateContainer(["game-player-card"]);



    playerCard.append(this.#generatePayerInstanceSection());
    playerCard.append(this.#generateDetailsSection());
    playerCard.append(this.#generateFlagSection());


    return playerCard;
  }

  #generatePayerInstanceSection() {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__player-instance"]);






    return playerInstanceSection;
  }

  #generateDetailsSection() {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__details-section"]);






    return playerInstanceSection;
  }

  #generateFlagSection() {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__flag-section"]);






    return playerInstanceSection;
  }
}
