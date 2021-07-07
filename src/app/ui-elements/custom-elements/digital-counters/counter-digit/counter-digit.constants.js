'use strict';
export { PALETTE } from './counter-digit-constants/counter-digit-palette';
export { CONFIG } from './counter-digit-constants/counter-digit-config';
export { DIGIT_POSITIONS } from './counter-digit-constants/counter-digit-positions';

export const DOM_ELEMENT_CLASS = {
    digit: 'counter-digit-canvas'
};

export const ATTRIBUTES = {
    value: 'value',
    theme: 'theme'
};

export const TEMPLATE = `
<canvas class='${DOM_ELEMENT_CLASS.digit}' width=%width% height=%height%></canvas>
`;
