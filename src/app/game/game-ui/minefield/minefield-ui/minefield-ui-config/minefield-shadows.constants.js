'use strict';
export const SHADOWS = {
    inner: {
        offsetX: -1,
        offsetY: -1,
        blur: 5,
        shadowAdjustment: 51
    },
    detonatedMine: {
        offsetX: 0,
        offsetY: 0,
        blur: 8,
        shadowAdjustment: -51
    },
    wrongFlagHint: {
        offsetX: 1,
        offsetY: 1,
        blur: 3
    },
    detectedMineTarget: {
        left: {
            offsetX: 1,
            offsetY: 0,
            blur: 3
        },
        right: {
            offsetX: -1,
            offsetY: 0,
            blur: 3
        }
    },
};
