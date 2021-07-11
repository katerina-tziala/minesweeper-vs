'use strict';
import { randomInteger, sortNumbersArrayAsc } from 'UTILS';

export const generateMinesPositions = (rows = 0, columns = 0, numberOfMines = 0) => {
  const maxPosition = rows * columns;
  const mineList = [];
  while (mineList.length < numberOfMines) {
    const minePosition = randomInteger(maxPosition);
    if (minePosition !== 0 && !mineList.includes(minePosition)) {
      mineList.push(minePosition);
    }
  }
  return sortNumbersArrayAsc(mineList);
};

