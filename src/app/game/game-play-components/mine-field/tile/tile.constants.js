"use strict";

export const DOM_ELEMENT_ID = {
  cell: "tile-cell__",
  button: "tile-cell-btn__",
};

export const DOM_ELEMENT_CLASS = {
  cell: "tile-cell",
  cellContent: "tile-cell__content--",
  activeButton: "tile-cell-btn--active",
  mineReveled: "tile-cell--revealed-mine",
  button: "tile-cell-btn",
  buttonColor: "tile-cell-btn-color--",
  buttonFlagged: "tile-cell-btn--flagged",
  buttonWronglyFlagged: "tile-cell-btn--wrongly-flagged",
  buttonMarked: "tile-cell-btn--marked",
  buttonRevealed: "tile-cell-btn--revealed",
};

export const TILE_BTN = {
  className: "tile-cell-btn",
  attributes: {
    "aria-label": "choose mine field tile",
  },
};
