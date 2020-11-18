"use strict";

export const FIELD_NAME = {
  consecutiveTurns: "consecutiveTurns",
  missedTurnsLimit: "missedTurnsLimit",
  turnDuration: "turnDuration",
  turnTimer: "turnTimer",
};

export const LIMITS = {
  missedTurnsLimit: {
    max: 10,
    min: 0
  },
  turnDuration: {
    max: 60,
    min: 3
  }
};

