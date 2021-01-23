"use strict";

export const DOM_ELEMENT_CLASS = {
  container: "game-results-container",
  info: "game-results-info",
  booleanResult: "result-boolean--",
  numberResult: "result-number",
  resultPlayer: "game-result-player",
  playerName: "game-result-player-name",
  winnerIndicator: "game-result-winner-indicator"
};

export const DURATION_CONTENT = {
  hours: ["hour", "hours"],
  minutes: ["minute", "minutes"],
  seconds: ["second", "seconds"]
};

export const CONTENT = {
  duration: "Game completed in ",
  gameInfo: {
    rounds: "Total rounds: ",
    playerStarted: "Player started the game: ",
  },
  playerStats: {
    moves: "moves",
    clearedTiles: "cleared tiles",
    detectedMines: "detected mines",
    flags: "flags",
    marks: "marks",
    detonatedMine: "detonated mine",
    clearedMinefield: "cleared minefield",
    exceededTurnsLimit: "exceeded missed turns limit",
    vs: "vs",
    sneakPeeks: "sneak peeks",
    sneakPeeksDuration: "sneak peeks total duration"
  }
};

export const BOOLEAN_RESULTS = ["detonatedMine", "clearedMinefield", "exceededTurnsLimit"];
export const DURATION_RESULTS = ["sneakPeeksDuration"];
