"use strict";

const GameEndType = {
  DetonatedMine: "detonated-mine",
  Cleared: "cleared-minefield",
  Detected: "detected-all-mines",
  ExceededTurnsLimit: "exceeded-turns-limit",
};

Object.freeze(GameEndType);

export { GameEndType };
