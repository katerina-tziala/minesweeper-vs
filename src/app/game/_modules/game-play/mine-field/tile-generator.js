"use strict";

import { sortNumbersArrayAsc, clone } from "~/_utils/utils";
import { Tile } from "./tile/tile";

export class TileGenerator {
  #_rows;
  #_columns;
  #minesPositions;

  constructor(levelSettings) {
    this.#rows = levelSettings.rows;
    this.#columns = levelSettings.columns;
    this.#minesPositions = levelSettings.minesPositions;
  }

  set #rows(value) {
    this.#_rows = value;
  }

  get #rows() {
    return this.#_rows;
  }

  set #columns(value) {
    this.#_columns = value;
  }

  get #columns() {
    return this.#_columns;
  }

  get #maxColumnPosition() {
    return this.#columns - 1;
  }

  get #maxRowPosition() {
    return this.#rows - 1;
  }

  generateTile(gameId, rowIndex, columnIndex) {
    return new Tile(gameId, this.getTileParams(rowIndex, columnIndex));
  }

  getTileParams(row, column) {
    const coordinates = { row, column };
    const position = this.getTilePosition(coordinates);
    const params = this.getTileContentAndNeighbors(coordinates, position);
    params.position = position;
    return params;
  }

  getTilePosition(coordinates) {
    return (coordinates.row * this.#columns) + coordinates.column;
  }

  getTileContentAndNeighbors(coordinates, position) {
    let content;
    let neighbors = [];
    if (this.positionInMinesList(position)) {
      content = "mine";
    } else {
      const gridPositionsAround = this.getGridPositions(coordinates).filter(aroundPorition => aroundPorition !== position);
      const minesAround = this.getMinesAround(gridPositionsAround);
      neighbors = gridPositionsAround;
      content = minesAround.length.toString();
    }
    return { content, neighbors };
  }

  positionInMinesList(position) {
    return this.#minesPositions.includes(position);
  }

  getGridPositions(coordinates) {
    const tilesPositions = this.getGridCoordinates(coordinates).map(tileCoordinates => this.getTilePosition(tileCoordinates))
    return sortNumbersArrayAsc(tilesPositions);
  }

  getGridCoordinates(referenceCoordinates) {
    let gridCoordinates = [];
    this.getGridCoordinatesInRow(referenceCoordinates).forEach(rowCoordinates => {
      gridCoordinates = gridCoordinates.concat(this.getGridCoordinatesInColumn(rowCoordinates));
    });
    return gridCoordinates;
  }

  getGridCoordinatesInRow(coordinates) {
    let rowCoordinates = [clone(coordinates)];
    rowCoordinates = rowCoordinates.concat(this.getCoordinatesInSameRow(coordinates, 1));
    rowCoordinates = rowCoordinates.concat(this.getCoordinatesInSameRow(coordinates, -1));
    return rowCoordinates;
  }

  getCoordinatesInSameRow(coordinates, columnStep) {
    const newCoordinates = clone(coordinates);
    newCoordinates.column = newCoordinates.column + columnStep;
    return (0 <= newCoordinates.column && newCoordinates.column <= this.#maxColumnPosition) ? [newCoordinates] : [];
  }

  getGridCoordinatesInColumn(coordinates) {
    let columnCoordinates = [clone(coordinates)];
    columnCoordinates = columnCoordinates.concat(this.getCoordinatesInSameColumn(coordinates, 1));
    columnCoordinates = columnCoordinates.concat(this.getCoordinatesInSameColumn(coordinates, -1));
    return columnCoordinates;
  }

  getCoordinatesInSameColumn(coordinates, rowStep) {
    const newCoordinates = clone(coordinates);
    newCoordinates.row = newCoordinates.row + rowStep;
    return (0 <= newCoordinates.row && newCoordinates.row <= this.#maxRowPosition) ? [newCoordinates] : [];
  }

  getMinesAround(positionsToCheck) {
    return positionsToCheck.filter(position => this.positionInMinesList(position));
  }

}
