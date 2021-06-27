'use strict';
import { randomInteger, sortNumbersArrayAsc } from 'UTILS';

export const generateMinesPositions = (rows, columns, numberOfMines) => {
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

