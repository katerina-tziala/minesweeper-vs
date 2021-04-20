"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./tile-cell.constants";

export class TileCell {
  #_id;

  constructor(tileId) {
    this.#id = tileId;
  }

  set #id(tileId) {
    this.#_id = DOM_ELEMENT_ID + tileId;
  }

  get #id() {
    return this.#_id;
  }

  get #cell() {
    return ElementHandler.getByID(this.#id);
  }

  #getCellStyle(content) {
    return DOM_ELEMENT_CLASS.cellContent + content;
  }

  generateView() {
    const tileCell = ElementGenerator.generateTableDataCell();
    ElementHandler.setID(tileCell, this.#id);
    ElementHandler.addStyleClass(tileCell, DOM_ELEMENT_CLASS.cell);
    return tileCell;
  }

  revealCellContent(content, isDetonatedMine) {
    return this.#cell.then(tileCell => {
      ElementHandler.addStyleClass(tileCell, this.#getCellStyle(content));
      if (isDetonatedMine) {
        ElementHandler.addStyleClass(tileCell, DOM_ELEMENT_CLASS.mineReveled);
      }
      return;
    });
  }

}
