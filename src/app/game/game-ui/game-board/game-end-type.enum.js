'use strict';

const GameEndType = {
  MinesDetected: 'MinesDetected',
  FieldCleared: 'FieldCleared',
  DetonatedMine: 'DetonatedMine',
  ExceededTurnsLimit: 'ExceededTurnsLimit',
};

Object.freeze(GameEndType);

export { GameEndType };
