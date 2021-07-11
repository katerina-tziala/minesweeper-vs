'use strict';

import '../game-timer/GameTimer';
import '../flags-counter/FlagsCounter';

export { TileChecker } from '../minefield/@minefield.module';
export { BoardFaceType } from '../board-face/@board-face.module';

export { DATES, arrayDifference } from 'UTILS';
export { ElementHandler } from 'UI_ELEMENTS';

export { GameEndType } from './game-end-type.enum';
export { PlayerGameStatusType } from './player-game-status-type.enum';
export { generateTemplate } from './game-board-generator/game-board-generator';
export { generateMinesPositions } from '../../game-utils/game-utils';