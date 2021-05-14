'use strict';
import { ElementHandler } from '../element-handler';
import { AriaHandler } from '../aria-handler';
import { ICON_BUTTON } from './buttons.constants';

export class ButtonGenerator {


  static #addClickListener(button, action) {
    if (button && action) {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        action();
      });
    }
  }

  static generateTextButton(buttonText, action) {
    const button = this.generateButton(action);
    ElementHandler.addStyleClass(button, 'button-text');
    ElementHandler.setContent(button, buttonText);
    return button;
  }

  static generateButton(action) {
    const button = document.createElement('button');
    ButtonGenerator.#addClickListener(button, action);
    return button;
  }


  ///

  static generateIconButton(type, action) {
    const button = this.generateButton(action);
    const params = ICON_BUTTON[type];
    if (params) {
      ElementHandler.addStyleClass(button, params.className);
      AriaHandler.setAriaLabel(button, params.ariaLabel);
    }
    return button;
  }

  static generateIconButtonClose(action) {
    const button = this.generateButton(action);
    const params = ICON_BUTTON.close;
    ElementHandler.addStyleClass(button, params.className);
    AriaHandler.setAriaLabel(button, params.ariaLabel);
    return button;
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
