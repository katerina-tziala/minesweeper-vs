"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  TARGET_CONTENT,
} from "./player-card-details.constants";

export class PlayerCardDetails {
  static generateDetailsSection(player, clearMinefield) {
    const playerInstanceSection = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.detailsSection,
    ]);
    const playerName = PlayerCardDetails.generatePlayerName(player.name);
    const playerTarget = PlayerCardDetails.generateGoalDetails(
      player,
      clearMinefield,
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

  static generateGoalDetails(player, clearMinefield) {
    const goalDetails = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gameGoalDetails,
    ]);
    const detailsLabel = PlayerCardDetails.generateGameTargetLabel(
      clearMinefield,
    );
    const gameTargetResult = PlayerCardDetails.generateGameTargetStatistics(
      player,
      clearMinefield,
    );
    goalDetails.append(detailsLabel, gameTargetResult);
    return goalDetails;
  }

  static generateGameTargetLabel(clearMinefield) {
    const targetLabel = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gameGoalDetailsTarget,
    ]);
    targetLabel.innerHTML = `${
      clearMinefield ? TARGET_CONTENT.clear : TARGET_CONTENT.detect
    }:`;
    return targetLabel;
  }

  static generateGameTargetStatistics(player, clearMinefield) {
    const gameTargetResult = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.gameTargetResult,
    ]);

    const result = PlayerCardDetails.generateGameResultContainer(
      player,
      clearMinefield,
    );
    gameTargetResult.append(result);

    if (player.goalTargetNumber) {
      const expectedResult = ElementGenerator.generateContainer([
        DOM_ELEMENT_CLASS.targetValue,
      ]);
      expectedResult.innerHTML = `/ ${player.goalTargetNumber}`;
      gameTargetResult.append(expectedResult);
    }

    return gameTargetResult;
  }

  static generateGameResultContainer(player, clearMinefield) {
    const gameResult = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.targetValue,
    ]);
    ElementHandler.setID(gameResult, PlayerCardDetails.getGameResultID(player));
    gameResult.innerHTML = clearMinefield
      ? player.revealedTiles
      : player.minesDetected;
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
