"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants.js";
import { valueDefined } from "~/_utils/validator";
import { ElementGenerator } from "HTML_DOM_Manager";
import { UserAvatar } from "~/components/user-avatar/user-avatar";
import { DOM_ELEMENT_CLASS, CONTENT, DURATION_CONTENT, BOOLEAN_RESULTS, DURATION_RESULTS } from "./game-results.constants";

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
    Object.keys(CONTENT.gameInfo).forEach(infoKey => {
      if (gameInfo[infoKey]) {
        const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.info]);
        container.innerHTML = CONTENT.gameInfo[infoKey] + gameInfo[infoKey];
        fragment.append(container);
      }
    });

    return fragment;
  }

  static generateDurationInfo(duration) {
    const durationString = CONTENT.duration + GameResults.getDurationString(duration) + TYPOGRAPHY.fullstop;
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.info]);
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
      readableDuration += `${durationStrings[1]} ${TYPOGRAPHY.and} `;
      readableDuration += durationStrings[2];
    } else if (durationStrings.length === 2) {
      readableDuration += ` ${TYPOGRAPHY.and} ${durationStrings[1]}`;
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
    if (gameResults.playersResults.length === 2) {
      table.append(GameResults.resultsTableHead(gameResults.playersResults, gameResults.gameInfo.draw));
    }
    const tableBody = GameResults.resultsTableBody(gameResults);
    table.append(tableBody);

    return table;
  }

  static resultsTableHead(playersResults, draw = false) {
    const tableRow = ElementGenerator.generateTableRow();

    const rowHeader = ElementGenerator.generateTableHeaderCell();

    const playerHeaders = playersResults.map(resultsOfPlayer => GameResults.playerHeader(resultsOfPlayer, draw));

    const separator = ElementGenerator.generateTableHeaderCell();
    separator.innerHTML = CONTENT.playerStats.vs;

    tableRow.append(rowHeader, playerHeaders[0], separator, playerHeaders[1]);

    const tableHead = ElementGenerator.generateTableHead();
    tableHead.append(tableRow);
    return tableHead;
  }

  static playerHeader(playerResults, draw = false) {
    const content = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.resultPlayer]);
    const avatar = UserAvatar.generate(playerResults.colorType, playerResults.isBot);
    const name = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.playerName]);
    name.innerHTML = playerResults.name;

    content.append(avatar, name);
    if (!draw && !playerResults.lostGame) {
      content.append(ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.winnerIndicator]));
    }
  
    const playerHeader = ElementGenerator.generateTableHeaderCell(content);
    return playerHeader;
  }

  static includedInStatistics(resultKey, playerResults) {
    return playerResults.every(resultsOfPlayer => valueDefined(resultsOfPlayer[resultKey]));
  }

  static resultsTableBody(gameResults) {
    const fragment = document.createDocumentFragment();

    gameResults.reportResults.forEach(resultKey => {
      if (GameResults.includedInStatistics(resultKey, gameResults.playersResults)) {
        const tableRow = GameResults.resultsRow(resultKey, gameResults.playersResults);
        fragment.append(tableRow);
      }
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
    return ElementGenerator.generateTableHeaderCell(CONTENT.playerStats[headerKey]);
  }

  static rowCell(resultKey, playerResults) {
    const content = GameResults.rowCellContent(resultKey, playerResults);
    return ElementGenerator.generateTableDataCell(content);
  }

  static rowCellContent(resultKey, playerResults) {
    if (BOOLEAN_RESULTS.includes(resultKey)) {
      return GameResults.booleanResult(playerResults[resultKey]);
    }

    if (DURATION_RESULTS.includes(resultKey)) {
      return GameResults.getDurationString(playerResults[resultKey]);
    }

    return GameResults.numberResult(playerResults[resultKey]);
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
