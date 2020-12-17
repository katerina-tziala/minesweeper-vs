"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  TARGET_CONTENT,
} from "./player-card-details.constants";

export class PlayerCardDetails {
  static getGameResultID(player) {
    return DOM_ELEMENT_ID.gameTargetResult + player.id;
  }

  static generatePlayerName(name) {
    const playerName = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.playerName,
    ]);
    playerName.innerHTML = name;
    return playerName;
  }

  static generateGameResultContainer(player, value = null) {
    const gameResult = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.targetValue,
    ]);
    ElementHandler.setID(gameResult, PlayerCardDetails.getGameResultID(player));
    gameResult.innerHTML =
      value === null ? TYPOGRAPHY.hyphen : value.toString();
    return gameResult;
  }

  static generateExpectedResultContainer(player) {
    const expectedResult = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.targetValue,
    ]);
    expectedResult.innerHTML = `/ ${player.goalTargetNumber}`;
    return expectedResult;
  }

  // CLEAR GAME DETAILS
  static generateClearGameDetailsSection(player) {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.detailsSection,
    ]);
    const playerName = PlayerCardDetails.generatePlayerName(player.name);

    const playerTarget = PlayerCardDetails.generateClearGameDetails(player);

    container.append(playerName, playerTarget);
    return container;
  }

  static generateClearGameDetails(player) {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gameGoalDetails,
    ]);

    const detailsLabel = PlayerCardDetails.generateClearGameTargetLabel();
    const gameTargetResult = PlayerCardDetails.generateClearGameTargetStatistics(
      player,
    );
    container.append(detailsLabel, gameTargetResult);
    return container;
  }

  static generateClearGameTargetLabel() {
    const targetLabel = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gameGoalDetailsTarget,
    ]);
    targetLabel.innerHTML = TARGET_CONTENT.clear;
    return targetLabel;
  }

  static generateClearGameTargetStatistics(player) {
    const gameTargetResult = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gameTargetResult,
    ]);

    const result = PlayerCardDetails.generateGameResultContainer(
      player,
      player.revealedTiles,
    );
    const expectedResult = PlayerCardDetails.generateExpectedResultContainer(
      player,
    );

    gameTargetResult.append(result, expectedResult);

    return gameTargetResult;
  }

  // DETECT GAME DETAILS
  static generateDetectGameDetailsSection(player, wrongFlagHint) {
    const playerInstanceSection = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.detailsSection,
    ]);
    const playerName = PlayerCardDetails.generatePlayerName(player.name);
    const playerTarget = PlayerCardDetails.generateDetectGameDetails(
      player,
      wrongFlagHint,
    );
    playerInstanceSection.append(playerName, playerTarget);
    return playerInstanceSection;
  }

  static generateDetectGameDetails(player, wrongFlagHint) {
    const container = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gameGoalDetails,
    ]);

    const detailsLabel = PlayerCardDetails.generateDetectGameTargetLabel(
      wrongFlagHint,
    );
    const gameTargetResult = PlayerCardDetails.generateDetectGameTargetStatistics(
      player,
      wrongFlagHint,
    );
    container.append(detailsLabel, gameTargetResult);
    return container;
  }

  static generateDetectGameTargetLabel(wrongFlagHint) {
    const targetLabel = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gameGoalDetailsTarget,
    ]);
    targetLabel.innerHTML = wrongFlagHint
      ? TARGET_CONTENT.detect
      : TARGET_CONTENT.toDetect;
    return targetLabel;
  }

  static generateDetectGameTargetStatistics(player, wrongFlagHint) {
    const gameTargetResult = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gameTargetResult,
    ]);

    const result = PlayerCardDetails.generateGameResultContainer(
      player,
      wrongFlagHint ? 0 : player.goalTargetNumber,
    );
    gameTargetResult.append(result);

    if (player.goalTargetNumber && wrongFlagHint) {
      const expectedResult = PlayerCardDetails.generateExpectedResultContainer(
        player,
      );
      gameTargetResult.append(expectedResult);
    }

    return gameTargetResult;
  }

  // UPDATE
  static getGameResultContainer(player) {
    return ElementHandler.getByID(PlayerCardDetails.getGameResultID(player));
  }

  static updateGameGoalStatistics(player, value) {
    return PlayerCardDetails.getGameResultContainer(player).then(
      (resultsContainer) => {
        resultsContainer.innerHTML = value;
      },
    );
  }
}
