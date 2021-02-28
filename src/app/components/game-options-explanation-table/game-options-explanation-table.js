"use strict";
import { ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS, CONTENT } from "./game-options-explanation-table.constants";
import { GameVSMode } from "GameEnums";
import { GameOptionsExplanationHelper as ExplanationHelper } from "./game-options-explanation-helper/game-options-explanation-helper";

export class GameOptionsExplanationTable {

  static generateFullGameInfoTable(invitationGame) {
    const table = ElementGenerator.generateTable();
    const tableBody = GameOptionsExplanationTable.generateFullGameInfoTableBody(invitationGame);
    table.append(tableBody);
    return table;
  }

  static generateFullGameInfoTableBody(invitationGame) {
    const { levelSettings, turnSettings, optionsSettings } = invitationGame;

    const tableBody = ElementGenerator.generateTableBody();

    const vsModeInfo = GameOptionsExplanationTable.generateVsModeInfo(optionsSettings.vsMode);
    const levelInfo = GameOptionsExplanationTable.generateLevelInfo(levelSettings);
    const turnsInfo = GameOptionsExplanationTable.generateTurnsInfo(optionsSettings.vsMode, turnSettings);
    const optionsInfo = GameOptionsExplanationTable.generateOptionsInfo(optionsSettings, levelSettings.numberOfMines);

    tableBody.append(vsModeInfo, levelInfo, turnsInfo, optionsInfo);

    return tableBody;
  }

  static generateVsModeInfo(vsMode) {
    const contentText = CONTENT[vsMode];
    const dataCellContent = `<p class="${DOM_ELEMENT_CLASS.vsMode}">${contentText}</p>`;
    return ElementGenerator.generateTableHeaderCellRow(CONTENT.vsMode, dataCellContent);
  }

  static generateLevelInfo(levelSettings) {
    const fragment = document.createDocumentFragment();
    let contentText = ExplanationHelper.generateLevelContent(levelSettings);
    const dataCellContent = `<p class="${DOM_ELEMENT_CLASS.level}">${contentText}</p>`;
    fragment.append(ElementGenerator.generateTableHeaderCellRow(CONTENT.level, dataCellContent));
    return fragment;
  }

  static generateTurnsInfo(vsMode, turnSettings) {
    const fragment = document.createDocumentFragment();
    if (!turnSettings) {
      return fragment;
    }

    const parallelMode = vsMode === GameVSMode.Parallel;
    turnSettings.turnTimer = !parallelMode ? turnSettings.turnTimer : false;

    const turnsDurationRow = GameOptionsExplanationTable.generateTurnsDurationRow(turnSettings.turnTimer, turnSettings.turnDuration);
    fragment.append(turnsDurationRow);

    if (!parallelMode) {
      const missedTurnsLimitRow = GameOptionsExplanationTable.generateMissedTurnsLimitRow(turnSettings);
      fragment.append(missedTurnsLimitRow);
    }

    return fragment;
  }

  static generateTurnsDurationRow(turnTimer, turnDuration = 0) {
    const dataCellContent = ExplanationHelper.generateTurnsDurationContent(turnTimer, turnDuration);
    return ElementGenerator.generateTableHeaderCellRow(CONTENT.turnDuration, dataCellContent);
  }

  static generateMissedTurnsLimitRow(turnSettings) {
    const dataCellContent = ExplanationHelper.generateTurnsLimitContent(turnSettings);
    return ElementGenerator.generateTableHeaderCellRow(CONTENT.missedTurnsLimit, dataCellContent);
  }

  static generateOptionsInfo(optionsSettings, numberOfMines) {
    const fragment = document.createDocumentFragment();

    const generalOptionsInfo = GameOptionsExplanationTable.generateGeneralOptionsInfo(optionsSettings);
    const strategyRow = GameOptionsExplanationTable.generateStrategyRow(optionsSettings);
    const allowedFlagsRow = GameOptionsExplanationTable.generateAllowedFlagsRow(numberOfMines, optionsSettings);
    const optionsBasedOnStrategyInfo = GameOptionsExplanationTable.generateStrategyOptionsInfo(optionsSettings);
    const sneakPeekRow = GameOptionsExplanationTable.generateSneakPeekRow(optionsSettings)

    fragment.append(generalOptionsInfo, strategyRow, allowedFlagsRow, optionsBasedOnStrategyInfo, sneakPeekRow);

    return fragment;
  }

  static generateAllowedFlagsRow(numberOfMines, optionsSettings) {
    const dataCellContent = ExplanationHelper.generateAllowedFlagsContent(numberOfMines, optionsSettings);
    return ElementGenerator.generateTableHeaderCellRow(CONTENT.allowedFlags, dataCellContent);
  }

  static generateSneakPeekRow(optionsSettings) {
    if (!ExplanationHelper.sneakPeekAllowedOnMode(optionsSettings)) {
      return document.createDocumentFragment();
    }
    const dataCellContent = ExplanationHelper.generateSneakPeekContent(optionsSettings.sneakPeekSettings);
    return ElementGenerator.generateTableHeaderCellRow(CONTENT.sneakPeek, dataCellContent);
  }

  static generateStrategyRow(optionsSettings) {
    const strategyAllowed = optionsSettings.tileFlagging;
    return GameOptionsExplanationTable.generateCheckTypeOptionRow(CONTENT.strategyKey, strategyAllowed);
  }

  static generateCheckTypeOptionRow(optionKey, value) {
    const dataCellContent = value ? CONTENT.checked : CONTENT.unChecked;
    return ElementGenerator.generateTableHeaderCellRow(CONTENT[optionKey], dataCellContent);
  }

  static generateCheckListOptionsRows(reportingOptions, optionsSettings) {
    const fragment = document.createDocumentFragment();
    reportingOptions.forEach(optionKey => {
      const row = GameOptionsExplanationTable.generateCheckTypeOptionRow(optionKey, optionsSettings[optionKey]);
      fragment.append(row);
    });
    return fragment;
  }

  static generateGeneralOptionsInfo(optionsSettings) {
    const optionsIrrelevantOfStrategy = ExplanationHelper.optionsIrrelevantOfStrategy(optionsSettings.vsMode);
    return GameOptionsExplanationTable.generateCheckListOptionsRows(optionsIrrelevantOfStrategy, optionsSettings);
  }

  static generateStrategyOptionsInfo(optionsSettings) {
    const optionsBasedOnStrategy = ExplanationHelper.optionsBasedOnStrategy(optionsSettings.vsMode);
    return GameOptionsExplanationTable.generateCheckListOptionsRows(optionsBasedOnStrategy, optionsSettings);
  }

}
