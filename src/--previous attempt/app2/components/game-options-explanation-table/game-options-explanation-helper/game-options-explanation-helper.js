"use strict";
import { CONTENT, VS_SETTINGS_PROPERTIES, FIELDS_BASED_ON_STRATEGY, ALLOW_SNEAK_PEEK_SETTINGS } from "./game-options-explanation-helper.constants";
import { GameVSMode } from "GameEnums";
import { replaceStringParameter, arrayDifference, arrayIntersection } from "~/_utils/utils";
import { TYPOGRAPHY } from "~/_constants/typography.constants";

export class GameOptionsExplanationHelper {

  static sneakPeekAllowedOnMode(optionsSettings) {
    if (!ALLOW_SNEAK_PEEK_SETTINGS.includes(optionsSettings.vsMode)) {
      return false;
    }

    if (!optionsSettings.sneakPeekSettings) {
      return false;
    }

    if (!optionsSettings.tileFlagging) {
      return false;
    }

    if (optionsSettings.openStrategy) {
      return false;
    }

    return true;
  }

  static generateLevelContent(levelSettings) {
    if (!levelSettings) {
      return TYPOGRAPHY.emptyString
    }
    let contentText = CONTENT.levelInfo;
    Object.keys(levelSettings).filter(key => key !== "minesPositions").forEach(key => {
      contentText = replaceStringParameter(contentText, levelSettings[key].toString());
    });
    return contentText;
  }

  static generateSneakPeekContent(sneakPeekSettings) {
    if (!sneakPeekSettings || !sneakPeekSettings.applied) {
      return CONTENT.notAllowed;
    }
    let dataCellContent = CONTENT.sneakPeekInfo;
    const onceAllowed = sneakPeekSettings.limit === 1;
    const timesString = onceAllowed ? CONTENT.time : CONTENT.times;
    const perTimeString = onceAllowed ? TYPOGRAPHY.emptyString : `${CONTENT.per} ${CONTENT.time}`;

    dataCellContent = replaceStringParameter(dataCellContent, sneakPeekSettings.limit);
    dataCellContent = replaceStringParameter(dataCellContent, timesString);
    dataCellContent = replaceStringParameter(dataCellContent, sneakPeekSettings.duration);
    dataCellContent += perTimeString;

    return dataCellContent;
  }

  static generateTurnsDurationContent(turnTimer, turnDuration = 0) {
    let dataCellContent = CONTENT.unlimited;
    if (turnTimer) {
      dataCellContent = `${turnDuration}${CONTENT.sec}`;
    }
    return dataCellContent;
  }

  static generateTurnsLimitContent(turnSettings) {
    let dataCellContent = CONTENT.unlimited;
    if (turnSettings && turnSettings.turnTimer) {
      const explanation = turnSettings.consecutiveTurns ? CONTENT.consecutive : CONTENT.total;
      dataCellContent = `${turnSettings.missedTurnsLimit} ${explanation}`;
    }
    return dataCellContent;
  }

  static generateAllowedFlagsContent(numberOfMines, optionsSettings) {
    const allowedFlagsNumber = (optionsSettings && optionsSettings.tileFlagging) ? numberOfMines : 0;
    let dataCellContent = CONTENT.unlimited;
    if (optionsSettings.unlimitedFlags) {
      dataCellContent = `${allowedFlagsNumber}`;
    }
    return dataCellContent;
  }

  static #vsModeProperties(vsMode = GameVSMode.Clear) {
    const vsModeProperties = VS_SETTINGS_PROPERTIES[vsMode];
    const reportedSeparately = [CONTENT.strategyKey, "unlimitedFlags"];
    return arrayDifference(vsModeProperties, reportedSeparately);
  }

  static optionsBasedOnStrategy(vsMode = GameVSMode.Clear) {
    const vsModeProperties = GameOptionsExplanationHelper.#vsModeProperties(vsMode);
    const optionsToKeep = arrayIntersection(vsModeProperties, FIELDS_BASED_ON_STRATEGY);
    return optionsToKeep;
  }

  static optionsIrrelevantOfStrategy(vsMode = GameVSMode.Clear) {
    const vsModeProperties = GameOptionsExplanationHelper.#vsModeProperties(vsMode);
    const optionsToKeep = arrayDifference(vsModeProperties, FIELDS_BASED_ON_STRATEGY);
    return optionsToKeep;
  }

}
