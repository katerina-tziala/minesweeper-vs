'use strict';
import { ElementHandler } from './element-handler';

export class ElementGenerator {

  static generateContainer(styleClasses, elementId) {
    const container = document.createElement('div');
    ElementHandler.addStylesAndId(container, styleClasses, elementId);
    return container;
  }

  static generateTitleH2(titleText) {
    const title = document.createElement('h2');
    ElementHandler.addStyleClass(title, 'title');
    ElementHandler.setContent(title, titleText);
    return title;
  }

  static generateLoaderIcon() {
    const loader = document.createElement('app-loader');
    loader.setAttribute('type', 'icon');
    return loader;
  }

//  <button class='button-text' disabled='true'>clear</button>
  // static generateButton(params, action) {
  //   params = { ...params };

  //   const button = document.createElement('button');
  //   button.type = 'button';

  //   button.addEventListener(params.actionType, action);
  //   delete params.actionType;

  //   ElementHandler.setParams(button, params);
  //   return button;
  // }

  // static generateTable() {
  //   return document.createElement('table');
  // }

  // static generateTableHead() {
  //   return document.createElement('thead');
  // }

  // static generateTableBody() {
  //   return document.createElement('tbody');
  // }

  // static generateTableRow() {
  //   return document.createElement('tr');
  // }

  // static generateTableHeaderCell(content) {
  //   const tableHeader = document.createElement('th');
  //   if (valueDefined(content)) {
  //     tableHeader.append(content);
  //   }
  //   return tableHeader;
  // }

  // static generateTableDataCell(content) {
  //   const tableCell = document.createElement('td');
  //   if (valueDefined(content)) {
  //     tableCell.innerHTML = content;
  //   }
  //   return tableCell;
  // }

  // static generateTableHeaderCellRow(headerContent, cellContent) {
  //   const row = ElementGenerator.generateTableRow();
  //   const header = ElementGenerator.generateTableHeaderCell(headerContent);
  //   const dataCell = ElementGenerator.generateTableDataCell(cellContent);
  //   row.append(header, dataCell);
  //   return row;
  // }

  // static generateSecondLevelHeader(content, styleClasses = [], elementId) {
  //   const header = document.createElement('h2');
  //   ElementHandler.addStylesAndId(header, styleClasses, elementId);
  //   if (valueDefined(content)) {
  //     header.innerHTML = content;
  //   }
  //   return header;
  // }


}
