"use strict";

export const DOM_ELEMENT_ID = {
  cell: "tile-cell__",
  button: "tile-button__",
};

export const DOM_ELEMENT_CLASS = {
  cell: "tile-cell",
  cellContent: "tile-cell__content--",
  activeButton: "tile-button--active",
  mineReveled: "tile-cell--revealed-mine",
  button: "tile-button",
  buttonColor: "tile-button-color--",
  buttonFlagged: "tile-button--flagged",
  buttonWronglyFlagged: "tile-button--wrongly-flagged",
  buttonMarked: "tile-button--marked",
  buttonRevealed: "tile-button--revealed",
};

export const TILE_BTN = {
  className: "tile-button",
  attributes: {
    "aria-label": "choose mine field tile",
  },
};
