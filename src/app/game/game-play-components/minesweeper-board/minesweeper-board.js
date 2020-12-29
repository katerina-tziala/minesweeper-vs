"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./minesweeper-board.constants";

export class MinesweeperBoard {
  #_gameId;

  constructor(gameId) {
    this.#gameId = gameId;
  }

  set #gameId(id) {
    this.#_gameId = id;
  }

  get #gameId() {
    return this.#_gameId;
  }

  get #boardId() {
    return DOM_ELEMENT_ID.board + this.#gameId;
  }

  get #minefieldId() {
    return DOM_ELEMENT_ID.minefield + this.#gameId;
  }

  get #boardStyles() {
    const styles = [DOM_ELEMENT_CLASS.board];
    styles.push(DOM_ELEMENT_CLASS.boardModifier + LocalStorageHelper.appSettings.mineType);
    return styles;
  }

  get #generateMinefieldContainer() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.mineField], this.#minefieldId);
    return container;
  }

  get generatedBoardContainer() {
    return ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.boardContainer,
    ]);
  }

  generateView() {
    const board = ElementGenerator.generateContainer(this.#boardStyles, this.#boardId);
    board.addEventListener("contextmenu", (event) => event.preventDefault());
    board.append(this.#generateMinefieldContainer);
    return board;
  }

  insertOnBoardAsFirst(board, newElementInBoard) {
    ElementHandler.addInChildNodes(board, newElementInBoard, 0);
  }

  get minefieldContainer() {
    return ElementHandler.getByID(this.#minefieldId);
  }
}
