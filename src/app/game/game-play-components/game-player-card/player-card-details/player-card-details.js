"use strict";

import { ElementGenerator } from "HTML_DOM_Manager";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, TARGET_CONTENT } from "./player-card-details.constants";

export class PlayerCardDetails {

  static generateDetailsSection(player, clearMinefield, targetValue) {
    const playerInstanceSection = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.detailsSection]);
    const playerName = PlayerCardDetails.generatePlayerName(player.name);
    const playerTarget = PlayerCardDetails.generateGoalDetails(player, clearMinefield, targetValue);
    playerInstanceSection.append(playerName, playerTarget);
    return playerInstanceSection;
  }

  static generatePlayerName(name) {
    const playerName = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.playerName]);
    playerName.innerHTML = name;
    return playerName;
  }

  static generateGoalDetails(player, clearMinefield, targetValue) {
    const goalDetails = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.gameGoalDetails]);
    const goalStatistics = PlayerCardDetails.getGameGoalStatistics(player, clearMinefield, targetValue);
    let goalDetailsContent = PlayerCardDetails.getGameTargetLabel(clearMinefield);
    goalDetailsContent += `<span id="${PlayerCardDetails.getGameResultID(player)}" class="${DOM_ELEMENT_CLASS.gameTargetResult}">${goalStatistics}</span>`;
    goalDetails.innerHTML = goalDetailsContent;
    return goalDetails;
  }

  static getGameResultID(player) {
    return DOM_ELEMENT_ID.gameTargetResult + player.id;
  }

  static getGameGoalStatistics(player, clearMinefield, targetValue) {
    let goalStatistics = clearMinefield ? player.revealedTiles : player.minesDetected;
    if (targetValue) {
      goalStatistics += ` / ${targetValue}`;
    }
    return goalStatistics;
  }

  static getGameTargetLabel(clearMinefield) {
    return `<span class=${DOM_ELEMENT_CLASS.gameGoalDetailsTarget}>${clearMinefield ? TARGET_CONTENT.clear : TARGET_CONTENT.detect}:</span>`;
  }
}
