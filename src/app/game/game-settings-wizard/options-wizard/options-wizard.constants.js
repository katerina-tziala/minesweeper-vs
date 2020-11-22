"use strict";

export const SETTINGS_PROPERTIES = {
  default: ["marks", "wrongFlagHint"],
  clear: ["unlimitedFlags", "openStrategy", "sneakPeek", "sneakPeekDuration"],
  detect: ["unlimitedFlags", "tileRevealing"],
  parallel: ["sameMinePositions", "openStrategy", "sneakPeek", "sneakPeekDuration"]
};

export const FIELD_NAME = {
  openStrategy: "openStrategy",
  sneakPeek: "sneakPeek",
  sneakPeekDuration: "sneakPeekDuration",
};

export const LIMITS = {
  sneakPeekDuration: {
    max: 10,
    min: 3
  }
};
