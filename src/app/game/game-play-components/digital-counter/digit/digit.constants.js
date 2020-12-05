"use strict";

export const DOM_ELEMENT_CLASS = {
  digit: "digit",
  digitLine: "digit__line",
  digitLineOn: "digit__line--on",
};

export const DIGIT_POSITIONS = {
  0: [1, 2, 3, 4, 5, 6],
  1: [3, 4],
  2: [2, 3, 5, 6, 7],
  3: [2, 3, 4, 5, 7],
  4: [1, 3, 4, 7],
  5: [1, 2, 4, 5, 7],
  6: [1, 2, 4, 5, 6, 7],
  7: [2, 3, 4],
  8: [1, 2, 3, 4, 5, 6, 7],
  9: [1, 2, 3, 4, 5, 7],
  minus: [7],
  undefined: [],
  noNumber: [2, 5, 7],
  upperExceeded: [1, 2, 3],
  bottomExceeded: [4, 5, 6]
};
