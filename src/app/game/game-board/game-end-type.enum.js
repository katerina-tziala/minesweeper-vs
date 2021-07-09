'use strict';

const GameEndType = {
  MinesDetected: 'mines-detected',
  FieldCleared: 'field-cleared',
  DetonatedMine: 'detonated-mine',
};

Object.freeze(GameEndType);

export { GameEndType };
