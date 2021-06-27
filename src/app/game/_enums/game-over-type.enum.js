'use strict';

const GameOverType = {
  DetonatedMine: 'detonatedMine',
  Cleared: 'clearedMinefield',
  ExceededTurnsLimit: 'exceededTurnsLimit',
  Detected: 'detectedAllMines'
};

Object.freeze(GameOverType);

export { GameOverType };
