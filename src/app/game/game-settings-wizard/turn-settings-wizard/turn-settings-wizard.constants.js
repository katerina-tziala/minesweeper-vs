"use strict";

export const FIELD_NAME = {
  turnTimer: "turnTimer",
  turnDuration: "turnDuration",
  missedTurnsLimit: "missedTurnsLimit",
  consecutiveTurns: "consecutiveTurns"
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

