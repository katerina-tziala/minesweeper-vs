"use strict";

export const SETTINGS_PROPERTIES = {
  level: "level",
  rows: "rows",
  columns: "columns",
  numberOfMines: "numberOfMines",
};

export const LIMITS = {
  customLevelBoard: {
    max: 30,
    min: 9,
  },
  numberOfMines: {
    min: 16,
    max: 0,
  },
  maxMinesPercentage: 0.9,
  minMinesPercentage: 0.12,
};

export const CONTENT = {
  title: "game level",
  labels: {
    level: "level",
    rows: "minefield rows",
    columns: "minefield columns",
    numberOfMines: "number of mines",
  }
};