"use strict";

import { ElementHandler } from "./element-handler";

export class ElementGenerator {
  static generateContainer(styleClasses, elementId) {
    const container = document.createElement("div");
    if (styleClasses && styleClasses.length) {
      ElementHandler.setStyleClass(container, styleClasses);
    }
    if (elementId) {
      ElementHandler.setID(container, elementId);
    }
    return container;
  }

  static generateButton(params, action) {
    params = { ...params };

    const button = document.createElement("button");
    button.type = "button";

    button.addEventListener(params.actionType, action);
    delete params.actionType;

    ElementHandler.setParams(button, params);
    return button;
  }

  static generateTable() {
    return document.createElement("table");
  }

  static generateTableHead() {
    return document.createElement("thead");
  }

  static generateTableBody() {
    return document.createElement("tbody");
  }

  static generateTableRow() {
    return document.createElement("tr");
  }

  static generateTableHeaderCell(content) {
    const tableHeader = document.createElement("th");
    if (content) {
      tableHeader.append(content);
    }
    return tableHeader;
  }

  static generateTableDataCell(content) {
    const tableCell = document.createElement("td");
    if (content) {
      tableCell.innerHTML(content);
    }
    return tableCell;
  }
}
