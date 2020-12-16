"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  TARGET_CONTENT,
} from "./player-card-details.constants";

export class PlayerCardDetails {

  static generateDetailsSection(player, clearMinefield, wrongFlagHint) {
    const playerInstanceSection = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.detailsSection,
    ]);
    const playerName = PlayerCardDetails.generatePlayerName(player.name);
    const playerTarget = PlayerCardDetails.generateGoalDetails(
      player,
      clearMinefield,
      wrongFlagHint,
    );
    playerInstanceSection.append(playerName, playerTarget);
    return playerInstanceSection;
  }

  static generatePlayerName(name) {
    const playerName = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.playerName,
    ]);
    playerName.innerHTML = name;
    return playerName;
  }

  static generateGoalDetails(player, clearMinefield, wrongFlagHint) {
    const goalDetails = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gameGoalDetails,
    ]);
    const detailsLabel = PlayerCardDetails.generateGameTargetLabel(
      clearMinefield,
      wrongFlagHint,
    );
    const gameTargetResult = PlayerCardDetails.generateGameTargetStatistics(
      player,
      wrongFlagHint,
    );
    goalDetails.append(detailsLabel, gameTargetResult);
    return goalDetails;
  }

  static getTargetLabelText(clearMinefield, wrongFlagHint) {
    if (clearMinefield) {
      return wrongFlagHint ? TARGET_CONTENT.clear : TARGET_CONTENT.toClear;
    }
    
    return  wrongFlagHint ? TARGET_CONTENT.detect : TARGET_CONTENT.toDetect;
  }

  static generateGameTargetLabel(clearMinefield, wrongFlagHint) {
    const targetLabel = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gameGoalDetailsTarget,
    ]);
    targetLabel.innerHTML = this.getTargetLabelText(clearMinefield, wrongFlagHint);
    return targetLabel;
  }

  static generateGameTargetStatistics(player, wrongFlagHint) {
    const gameTargetResult = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gameTargetResult,
    ]);

    const result = PlayerCardDetails.generateGameResultContainer(player, wrongFlagHint ? 0 : player.targetValue);
    gameTargetResult.append(result);

    if (player.goalTargetNumber && wrongFlagHint) {
      const expectedResult = ElementGenerator.generateContainer([
        DOM_ELEMENT_CLASS.targetValue,
      ]);
      expectedResult.innerHTML =`/ ${player.goalTargetNumber}`;
      gameTargetResult.append(expectedResult);
    }

    return gameTargetResult;
  }

  static generateGameResultContainer(player, value = null) {
    const gameResult = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.targetValue,
    ]);
    ElementHandler.setID(gameResult, PlayerCardDetails.getGameResultID(player));
    gameResult.innerHTML = value === null ? TYPOGRAPHY.hyphen : value.toString();
    return gameResult;
  }

  static getGameResultID(player) {
    return DOM_ELEMENT_ID.gameTargetResult + player.id;
  }

  static getGameResultContainer(player) {
    return ElementHandler.getByID(PlayerCardDetails.getGameResultID(player));
  }

  // UPDATE
  static updateGameGoalStatistics(player, value) {
    return PlayerCardDetails.getGameResultContainer(player).then(
      (resultsContainer) => {
        resultsContainer.innerHTML = value;
      },
    );
  }
}
