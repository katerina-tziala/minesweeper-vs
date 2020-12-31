"use strict";

const GameOverType = {
  DetonatedMine: "detonated-mine",
  Cleared: "cleared-minefield",
  ExceededTurnsLimit: "exceeded-turns-limit",
  Detected: "detected-all-mines"
};

Object.freeze(GameOverType);

export { GameOverType };
