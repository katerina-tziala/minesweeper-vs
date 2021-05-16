export const DEFAULT_SETTINGS = {
  clear: {
    flagging: true,
    unlimitedFlags: true,
    marks: true,
    misplacedFlagHint: false,
    openStrategy: true,
    // predefined
    // revealing: true,
    // sneakPeek: false,
    // sneakPeekDuration: 3
  },
  detect: {
    revealing: true,
    unlimitedFlags: true,
    marks: true,
    misplacedFlagHint: false,
    // predefined
    // flagging: true
  },
  parallel: {
    identicalMines: true,
    marks: true,
    misplacedFlagHint: false,
    openCompetition: true,
    // predefined
    // revealing: true,
    // flagging: true
    // sneakPeek: false,
    // sneakPeekDuration: 3
  },
  original: {
    marks: true,
    misplacedFlagHint: false,
    // predefined
    // revealing: true,
    // flagging: true
  }
};

export const DEFAULT_SETTINGS_NO_FLAGGING = {
  flagging: false,
  unlimitedFlags: false,
  marks: false,
  misplacedFlagHint: false,
  openStrategy: false,
  sneakPeek: false,
  sneakPeekDuration: 0
};
