'use strict';
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
    detectedMineTarget: {
        left: {
            shadowOffsetX: 1,
            shadowOffsetY: 0,
            shadowBlur: 3
        },
        right: {
            shadowOffsetX: -1,
            shadowOffsetY: 0,
            shadowBlur: 3
        }
    },
};
