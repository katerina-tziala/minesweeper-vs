"use strict";

export const VS_SETTINGS_PROPERTIES = {
  clear: [
    "tileFlagging",
    "unlimitedFlags",
    "wrongFlagHint",
    "marks",
    "openStrategy"
  ],
  detect: ["unlimitedFlags", "wrongFlagHint", "tileRevealing", "marks"],
  parallel: [
    "identicalMines",
    "marks",
    "wrongFlagHint",
    "openCompetition"
  ],
};

export const FIELDS_BASED_ON_STRATEGY = [
  "unlimitedFlags",
  "wrongFlagHint",
  "marks",
  "openStrategy",
  "openCompetition"
];

export const ALLOW_SNEAK_PEEK_SETTINGS = ["clear", "parallel"];
