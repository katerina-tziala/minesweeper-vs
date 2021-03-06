"use strict";

export const FIELD_NAME = {
  turnTimer: "turnTimer",
  turnDuration: "turnDuration",
  missedTurnsLimit: "missedTurnsLimit",
  consecutiveTurns: "consecutiveTurns",
};

export const BOUNDARIES = {
  missedTurnsLimit: {
    max: 10,
    min: 1,
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
