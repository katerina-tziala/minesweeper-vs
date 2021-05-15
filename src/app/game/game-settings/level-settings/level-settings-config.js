export const LEVEL_PARAMS = {
  beginner: {
    rows: 9,
    columns: 9,
    numberOfMines: 16,
  },
  intermediate: {
    rows: 16,
    columns: 16,
    numberOfMines: 40,
  },
  expert: {
    rows: 16,
    columns: 30,
    numberOfMines: 99,
  },
  custom: {
    rows: 24,
    columns: 24,
    numberOfMines: 115,
  },
};

export const BOUNDARIES = {
  board: {
    max: 99,
    min: 2,
  },
  numberOfMines: {
    min: 0,
    max: 0,
  },
  maxMinesPercentage: 0.9,
  minMinesPercentage: 0.1,
};
