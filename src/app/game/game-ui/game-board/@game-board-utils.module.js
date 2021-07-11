'use strict';

import '../minefield/Minefield';
import '../game-timer/GameTimer';
import '../flags-counter/FlagsCounter';
import '../board-face/BoardFace';

export { DATES, arrayDifference } from 'UTILS';
export { ElementHandler } from 'UI_ELEMENTS';
export { BoardFaceType } from '../board-face/board-face-type.enum';
export { TileChecker } from '../minefield/tile/@tile.module';
export { GameEndType } from './game-end-type.enum';
export { PlayerGameStatusType } from './player-game-status-type.enum';
export { generateTemplate } from './game-board-generator/game-board-generator';
export { generateMinesPositions } from '../../game-utils/game-utils';