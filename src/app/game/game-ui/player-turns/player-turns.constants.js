'use strict';
export { CONFIG } from './player-turns-config/player-turns.config';
export { PALETTE } from './player-turns-config/player-turns-palette.constants';

export const DOM_ELEMENT_CLASS = {
    canvas: 'turns-canvas'
};

export const ATTRIBUTES = {
    direction: 'direction',
    fullCircle: 'full-circle',
    turns: 'turns',
    missedTurns: 'missed-turns',
    theme: 'theme'
};

export const TEMPLATE = `
<canvas class='${DOM_ELEMENT_CLASS.canvas}' width='%width%' height='%height%'></canvas>
`;