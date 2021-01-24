"use strict";

export const SETTINGS_PROPERTIES = {
  default: ["marks", "wrongFlagHint"],
  clear: [
    "tileFlagging",
    "unlimitedFlags",
    "wrongFlagHint",
    "marks",
    "openStrategy",
  ],
  detect: ["unlimitedFlags", "wrongFlagHint", "tileRevealing", "marks"],
  parallel: [
    "identicalMines",
    "marks",
    "wrongFlagHint",
    "openCompetition",
  ],
};

export const FIELD_NAME = {
  tileFlagging: "tileFlagging",
  openStrategy: "openStrategy",
  openCompetition: "openCompetition"
};

export const FIELDS_BASED_ON_STRATEGY = [
  "unlimitedFlags",
  "wrongFlagHint",
  "marks",
  "openStrategy",
  "openCompetition"
];

export const CONTENT = {
  title: "game options",
  labels: {
    marks: "marks",
    tileRevealing: "reveal tiles",
    identicalMines: "identical minefield",
    tileFlagging: "strategy",
    wrongFlagHint: "wrong flag hint",
    unlimitedFlags: "unlimited flags",
    openCompetition: "open competition",
    openStrategy: "open strategy",
    sneakPeek: "sneak peek",
    sneakPeekDuration: "sneak peek duration",
    sneakPeeksLimit: "sneak peeks limit"
  }
};
