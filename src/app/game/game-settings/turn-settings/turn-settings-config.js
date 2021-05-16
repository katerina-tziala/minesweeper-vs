export const DEFAULT_SETTINGS = {
  turnTimer: true,
  turnDuration: 5,
  missedTurnsLimit: 10,
  consecutiveTurns: true
};

export const DEFAULT_SETTINGS_OFF = {
  turnTimer: false,
  turnDuration: 0,
  missedTurnsLimit: 0,
  consecutiveTurns: false
};

export const BOUNDARIES = {
  missedTurnsLimit: {
    max: 10,
    min: 1,
  },
  turnDuration: {
    max: 90,
    min: 5,
  },
  off: {
    max: 0,
    min: 0
  },
};
