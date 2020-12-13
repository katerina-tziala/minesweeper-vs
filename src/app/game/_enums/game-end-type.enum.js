"use strict";

const GameEndType = {
  DetonatedMine: "detonated-mine",
  Cleared: "cleared-minefield",
  ExceededTurnsLimit: "exceeded-turns-limit"
};

Object.freeze(GameEndType);

export { GameEndType };
