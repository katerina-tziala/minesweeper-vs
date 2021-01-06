"use strict";

export const SETTINGS_PROPERTIES = {
  default: ["marks", "wrongFlagHint"],
  clear: [
    "unlimitedFlags",
    "wrongFlagHint",
    "marks",
    "tileFlagging",
    "openStrategy",
    "sneakPeek",
    "sneakPeekDuration",
    "sneakPeekLimit",
  ],
  detect: ["unlimitedFlags", "wrongFlagHint", "tileRevealing", "marks"],
  parallel: [
    "identicalMines",
    "marks",
    "wrongFlagHint",
    "openCompetition",
    "sneakPeek",
    "sneakPeekDuration",
    "sneakPeekLimit",
  ],
};

export const FIELD_NAME = {
  openStrategy: "openStrategy",
  openCompetition: "openCompetition",
  sneakPeek: "sneakPeek",
  sneakPeekDuration: "sneakPeekDuration",
};

export const LIMITS = {
  sneakPeekDuration: {
    max: 10,
    min: 3,
  },
};

export const LABELS = {
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
  sneakPeekLimit: "sneak peeks limit",
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
  }
};