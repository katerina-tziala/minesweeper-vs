"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "../../_utils/local-storage-helper";
import { DOM_ELEMENT_CLASS, BOARD_SECTION, DASHBOARD_SECTION, ACTION_BUTTONS } from "./game-play.constants";
export class GamePlayViewHelper {

  static get boardMineTypeStyleClass() {
    return DOM_ELEMENT_CLASS.board + TYPOGRAPHY.doubleHyphen + LocalStorageHelper.retrieve("settings").mineType;
  }

  static getBoardID(gameID) {
    return DOM_ELEMENT_CLASS.board + TYPOGRAPHY.doubleHyphen + gameID;
  }

  static getBoardSectionID(sectionName, gameID) {
    return sectionName + TYPOGRAPHY.doubleHyphen + gameID;
  }

  static generateBoardSection(sectionName, gameID) {
    return ElementGenerator.generateContainer([sectionName], GamePlayViewHelper.getBoardSectionID(sectionName, gameID));
  }

  static generateBoard(gameID) {
    const board = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.board, GamePlayViewHelper.boardMineTypeStyleClass], GamePlayViewHelper.getBoardID(gameID));
    board.append(GamePlayViewHelper.generateBoardSection(BOARD_SECTION.boardActions, gameID));
    board.append(GamePlayViewHelper.generateDashBoard(gameID));
    board.append(GamePlayViewHelper.generateBoardSection(BOARD_SECTION.mineField, gameID));
    return board;
  }

  static generateDashBoard(gameID) {
    const dashBoard = GamePlayViewHelper.generateBoardSection(BOARD_SECTION.dashBoard, gameID);
    Object.values(DASHBOARD_SECTION).forEach(section => dashBoard.append(GamePlayViewHelper.generateBoardSection(section, gameID)));
    return dashBoard;
  }

  static getClearedGameSection(sectionId) {
    return ElementHandler.getByID(sectionId).then(section => {
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
