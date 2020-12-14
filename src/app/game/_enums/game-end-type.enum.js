"use strict";

const GameEndType = {
  DetonatedMine: "detonated-mine",
  Cleared: "cleared-minefield",
  ExceededTurnsLimit: "exceeded-turns-limit",
  Detected: "detected-all-mines"
};

Object.freeze(GameEndType);

export { GameEndType };
