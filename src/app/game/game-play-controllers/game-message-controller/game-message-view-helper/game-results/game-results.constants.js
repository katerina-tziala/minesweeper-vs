"use strict";

export const DOM_ELEMENT_CLASS = {
  container: "game-results-container",
  info: "game-results-info",
  booleanResult: "result-boolean--",
  numberResult: "result-number",
  resultPlayer: "game-result-player",
};

export const DURATION_CONTENT = {
  hours: ["hour", "hours"],
  minutes: ["minute", "minutes"],
  seconds: ["second", "seconds"]
};

export const CONTENT = {
  duration: "Game completed in ",
  rounds: "Total rounds: ",
  moves: "Moves",
  clearedTiles: "Cleared Tiles",
  detectedMines: "Detected Mines",
  flags: "Flags",
  marks: "Marks",
  detonatedMine: "Detonated Mine",
  exceededTurnsLimit: "Exceeded Missed Turns Limit",
  vs: "vs"
};

export const BOOLEAN_RESULTS = ["detonatedMine", "exceededTurnsLimit"];
