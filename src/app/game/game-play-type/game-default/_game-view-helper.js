"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import {
  DOM_ELEMENT_CLASS,
  BOARD_SECTION,
  DASHBOARD_SECTION,
} from "./_game.constants";

export class GameViewHelper {
  static get boardMineTypeStyleClass() {
    return (
      DOM_ELEMENT_CLASS.board +
      TYPOGRAPHY.doubleHyphen +
      LocalStorageHelper.appSettings.mineType
    );
  }

  static getBoardID(gameID) {
    return DOM_ELEMENT_CLASS.board + TYPOGRAPHY.doubleUnderscore + gameID;
  }

  static getBoardSectionID(sectionName, gameID) {
    return sectionName + TYPOGRAPHY.doubleUnderscore + gameID;
  }

  static generateBoardSection(sectionName, gameID) {
    return ElementGenerator.generateContainer(
      [sectionName],
      GameViewHelper.getBoardSectionID(sectionName, gameID),
    );
  }

  static generateBoard(gameID) {
    const board = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.board, GameViewHelper.boardMineTypeStyleClass],
      GameViewHelper.getBoardID(gameID),
    );
    board.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
    // board.append(GameViewHelper.generateBoardSection(BOARD_SECTION.boardActions, gameID));
    board.append(GameViewHelper.generateDashBoard(gameID));
    board.append(
      GameViewHelper.generateBoardSection(BOARD_SECTION.mineField, gameID),
    );
    return board;
  }

  static generateDashBoard(gameID) {
    const dashBoard = GameViewHelper.generateBoardSection(
      BOARD_SECTION.dashBoard,
      gameID,
    );
    Object.values(DASHBOARD_SECTION).forEach((section) =>
      dashBoard.append(GameViewHelper.generateBoardSection(section, gameID)),
    );
    return dashBoard;
  }

  static getClearedGameSection(sectionId) {
    return ElementHandler.getByID(sectionId).then((section) => {
      ElementHandler.clearContent(section);
      return section;
    });
  }

  static generateActionButton(params, action) {
    const actionButton = ElementGenerator.generateButton(params, action);
    ElementHandler.addStyleClass(actionButton, DOM_ELEMENT_CLASS.actionButton);
    return actionButton;
  }
}
