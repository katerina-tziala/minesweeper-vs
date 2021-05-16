export const SETTINGS_PROPERTIES = {
  flagging: 'flagging',
  revealing: 'revealing',
  unlimitedFlags: 'unlimitedFlags',
  marks: 'marks',
  misplacedFlagHint: 'misplacedFlagHint',
  identicalMines: 'identicalMines',
  openStrategy: 'openStrategy',
  openCompetition: 'openCompetition'
};

export const MODE_PROPERTIES = {
  clear: ['flagging', 'unlimitedFlags', 'marks', 'misplacedFlagHint', 'openStrategy'],
  detect: ['revealing', 'unlimitedFlags', 'marks', 'misplacedFlagHint'],
  parallel: ['identicalMines', 'marks', 'misplacedFlagHint', 'openCompetition'],
  original: ['marks', 'misplacedFlagHint'],
};

export const STRATEGY_DEPENDED_PROPERTIES = [
  'unlimitedFlags',
   'marks',
   'misplacedFlagHint',
   'openStrategy',
   'openCompetition',

];
// 'sneakPeek',
// 'sneakPeekDuration'


// export const FIELDS_BASED_ON_STRATEGY = [
//   "unlimitedFlags",
//   "wrongFlagHint",
//   "marks",
//   "openStrategy",
//   "openCompetition"
// ];

// export const ALLOW_SNEAK_PEEK_SETTINGS = ["clear", "parallel"];
