'use strict';
export { PALLETE } from './minefield-pallete.constants';
export { ICONS } from './minefield-icons.constants';

export const STYLES_CONFIG = {
    canvasPadding: 1,
    tileSize: 28,
    tileRadius: 5,
    content: {
        font: '16px Nunito',
        padding: {
            left: 8,
            top: 20,
        },
        colorAdjustment: 50
    },
    detonatedMinePadding: 3,
    wrongFlagHint: {
        width: 6,
        startPadding: 8
    }
};

export const SHADOWS = {
    inner: {
        shadowOffsetX: -1,
        shadowOffsetY: -1,
        shadowBlur: 5,
        shadowAdjustment: 51
    },
    detonatedMine: {
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 8,
        shadowAdjustment: -51
    },
    wrongFlagHint: {
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 3
    },
};
