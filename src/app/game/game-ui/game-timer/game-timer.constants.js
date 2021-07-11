'use strict';

export const CONFIG = {
    turnTimer: {
        format: 'm:s',
        step: -1,
        startValue: 0,
    },
    gameTimer: {
        format: 'h:m:s',
        step: 1,
        startValue: 0,
    }
};

const DOM_ELEMENT_CLASS = {
    icon: 'game-timer-icon'
};

export const ATTRIBUTES = {
    turnTimer: 'turn-timer',
    turnDuration: 'turn-duration',
    colorType: 'color-type',
};

export const TEMPLATE = `
    <div class='${DOM_ELEMENT_CLASS.icon}'></div>
`;
