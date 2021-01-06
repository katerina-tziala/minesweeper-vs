"use strict";

export const FIELD_NAME = {
  turnTimer: "turnTimer",
  turnDuration: "turnDuration",
  missedTurnsLimit: "missedTurnsLimit",
  consecutiveTurns: "consecutiveTurns",
};

export const LIMITS = {
  missedTurnsLimit: {
    max: 10,
    min: 0,
  },
  turnDuration: {
    max: 90,
    min: 3,
  },
};

export const CONTENT = {
  title: "game turns",
  labels: {
    turnTimer: "turn timer",
    turnDuration: "turn duration (sec)",
    missedTurnsLimit: "allowed missed turns",
    consecutiveTurns: "consecutive missed turns"
  }
};
