'use strict';

const MinefieldState = {
  InProgress: 'in-progress',
  MinesDetected: 'mines-detected',
  FieldCleared: 'field-cleared',
  DetonatedMine: 'detonated-mine',
};

Object.freeze(MinefieldState);

export { MinefieldState };
