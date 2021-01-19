"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants.js";
import { timeoutPromise } from "~/_utils/utils";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, DURATION_CONTENT, BOOLEAN_RESULTS } from "./game-results.constants";

export class GameResults {

  static get newContainer() {
    return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container]);
  }

  static generateView(gameResults) {
    const container = GameResults.newContainer;
    const gameInfo = GameResults.generateGameInfo(gameResults.gameInfo);
    const resultsTable = GameResults.generateResultsTable(gameResults);
    container.append(gameInfo, resultsTable);
    return container;
  }

  static generateGameInfo(gameInfo) {
    const fragment = document.createDocumentFragment();
    const duration = GameResults.generateDurationInfo(gameInfo.duration);
    fragment.append(duration);
    //console.log(gameInfo);
    return fragment;
  }

  static generateDurationInfo(duration) {
    const durationString = CONTENT.duration + GameResults.getDurationString(duration) + TYPOGRAPHY.fullstop;
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.duration]);
    container.innerHTML = durationString;
    return container;
  }

  static getDurationString(duration) {
    const durationStrings = [];
    Object.keys(duration).forEach(key => {
      const durationPart = GameResults.getTimeString(duration[key], DURATION_CONTENT[key]);
      if (durationPart) {
        durationStrings.push(durationPart);
      }
    });

    if (!durationStrings.length) {
      return TYPOGRAPHY.hyphen;
    }

    let readableDuration = durationStrings[0];

    if (durationStrings.length === 3) {
      readableDuration += TYPOGRAPHY.commaAndSpace;
      readableDuration += `${durationStrings[1]} ${TYPOGRAPHY.and} `
      readableDuration += durationStrings[2];
    } else if (durationStrings.length === 2) {
      readableDuration += ` ${TYPOGRAPHY.and} ${durationStrings[1]}`
    }

    return readableDuration;
  }

  static getTimeString(value, content) {
    if (value) {
      const text = (value === 1) ? content[0] : content[1];
      return `${value} ${text}`;
    }
    return undefined;
  }


  static generateResultsTable(gameResults) {
    const table = ElementGenerator.generateTable();

   // console.log(gameResults);
    if (gameResults.playersResults.length === 2) {
      console.log("vs table");
    }

    const tableBody = GameResults.resultsTableBody(gameResults);
    table.append(tableBody);

    return table;
  }


  static resultsTableBody(gameResults) {
    const fragment = document.createDocumentFragment();
    gameResults.reportResults.forEach(resultKey => {
      const tableRow = GameResults.resultsRow(resultKey, gameResults.playersResults);
      fragment.append(tableRow);
    });

    const tableBody = ElementGenerator.generateTableBody();
    tableBody.append(fragment);
    return tableBody;
  }

  static resultsRow(resultKey, playersResults) {
    const tableRow = ElementGenerator.generateTableRow();
    const tableHeader = GameResults.rowHeader(resultKey);
    const rowCellPlayerA = GameResults.rowCell(resultKey, playersResults[0]);
    tableRow.append(tableHeader, rowCellPlayerA);

    if (playersResults.length === 2) {
      const separatorCell = GameResults.separatorCell();
      const rowCellPlayerB = GameResults.rowCell(resultKey, playersResults[1]);
      tableRow.append(separatorCell, rowCellPlayerB);
    }

    return tableRow;
  }

  static rowHeader(headerKey) {
    return ElementGenerator.generateTableHeaderCell(CONTENT[headerKey]);
  }

  static rowCell(resultKey, playerResults) {
    let content;
    if (BOOLEAN_RESULTS.includes(resultKey)) {
      content = GameResults.booleanResult(playerResults[resultKey]);
    } else {
      content = GameResults.numberResult(playerResults[resultKey]);
    }
    return ElementGenerator.generateTableDataCell(content);
  }

  static booleanResult(value) {
    const style = `${DOM_ELEMENT_CLASS.booleanResult}${value}`;
    const content = `<span class="${style}"></span>`;
    return content;
  }

  static numberResult(value) {
    return `<span class="${DOM_ELEMENT_CLASS.numberResult}">${value}</span>`;
  }

  static separatorCell() {
    return ElementGenerator.generateTableDataCell();
  }

}
