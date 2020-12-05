"use strict";


import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";



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
    playerCard.append(this.#generateFlagSection(player, opponent));


    return playerCard;
  }

  #generatePayerInstanceSection(player, opponent) {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__player-instance"]);


    const playerIcon = ElementGenerator.generateContainer(["player-instance-icon"]);
    // ElementHandler.setID(playerIcon, "player-instance-icon"+"--"+player.id);
    // console.log(player);


    const turns = ElementGenerator.generateContainer(["turns-container"]);
    for (let index = 1; index < 11; index++) {
      const turnIndicator = ElementGenerator.generateContainer(["turn-indicator", "turn-indicator--" + index]);

      turns.append(turnIndicator);
    }

    playerInstanceSection.append(turns);

   // playerInstanceSection.append(playerIcon);

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

  #generateFlagSection(player, opponent) {
    const playerInstanceSection = ElementGenerator.generateContainer(["game-player-card__flag-section"]);
    // if (opponent) {
    //   ElementHandler.addStyleClass(playerInstanceSection, "direction-right")
    // } else {
    //   ElementHandler.addStyleClass(playerInstanceSection, "direction-left")
    // }







    return playerInstanceSection;
  }
}
