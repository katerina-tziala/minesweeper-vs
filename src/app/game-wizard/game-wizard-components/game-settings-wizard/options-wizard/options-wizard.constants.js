"use strict";

export const SETTINGS_PROPERTIES = {
  default: ["marks", "wrongFlagHint"],
  clear: [
    "tileFlagging",
    "unlimitedFlags",
    "wrongFlagHint",
    "marks",
    "openStrategy",
    "sneakPeek",
    "sneakPeekDuration",
    "sneakPeeksLimit",
  ],
  detect: ["unlimitedFlags", "wrongFlagHint", "tileRevealing", "marks"],
  parallel: [
    "identicalMines",
    "marks",
    "wrongFlagHint",
    "openCompetition",
    "sneakPeek",
    "sneakPeekDuration",
    "sneakPeeksLimit",
  ],
};

export const FIELD_NAME = {
  tileFlagging: "tileFlagging",
  openStrategy: "openStrategy",
  openCompetition: "openCompetition",
  sneakPeek: "sneakPeek",
  sneakPeekDuration: "sneakPeekDuration",
  sneakPeeksLimit: "sneakPeeksLimit"
};

export const FIELDS_BASED_ON_STRATEGY = [
  "unlimitedFlags",
  "wrongFlagHint",
  "marks",
  "openStrategy",
  "openCompetition",
  "sneakPeek"
];

export const SNEAK_PEEK_NUMBER_INPUTS = [
  "sneakPeekDuration",
  "sneakPeeksLimit"
];

export const LIMITS = {
  sneakPeekDuration: {
    max: 10,
    min: 3,
  },
  sneakPeeksLimit: {
    max: 99,
    min: 1,
  },
};

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