'use strict';

const TileState = {
  Untouched: 'untouched',
  Revealed: 'revealed',
  Flagged: 'flagged',
  Marked: 'marked'
};

Object.freeze(TileState);

export { TileState };
