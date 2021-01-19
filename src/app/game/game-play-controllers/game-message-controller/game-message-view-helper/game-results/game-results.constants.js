"use strict";

export const DOM_ELEMENT_CLASS = {
  container: "game-results-container",
  duration: "game-results-duration",
  booleanResult: "result-boolean--",
  numberResult: "result-number",
  resultSeparator: "result-separator",
};

export const DURATION_CONTENT = {
  hours: ["hour", "hours"],
  minutes: ["minute", "minutes"],
  seconds: ["second", "seconds"]
};

export const CONTENT = {
  duration: "Game completed in ",
  moves: "Moves",
  clearedTiles: "Cleared Tiles",
  detectedMines: "Detected Mines",
  flags: "Flags",
  marks: "Marks",
  detonatedMine: "Detonated Mine",
  exceededTurnsLimit: "Exceeded Missed Turns Limit",
};

export const BOOLEAN_RESULTS = ["detonatedMine", "exceededTurnsLimit"];
