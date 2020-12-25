"use strict";

export const SETTINGS_PROPERTIES = {
  default: ["marks", "wrongFlagHint"],
  clear: [
    "unlimitedFlags",
    "wrongFlagHint",
    "marks",
    "openStrategy",
    "sneakPeek",
    "sneakPeekDuration",
  ],
  detect: ["unlimitedFlags", "wrongFlagHint", "marks", "tileRevealing"],
  parallel: [
    "marks",
    "wrongFlagHint",
    "identicalMines",
    "openStrategy",
    "sneakPeek",
    "sneakPeekDuration",
  ],
};

export const FIELD_NAME = {
  openStrategy: "openStrategy",
  sneakPeek: "sneakPeek",
  sneakPeekDuration: "sneakPeekDuration",
};

export const LIMITS = {
  sneakPeekDuration: {
    max: 10,
    min: 3,
  },
};
