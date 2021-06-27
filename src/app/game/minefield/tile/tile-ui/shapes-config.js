'use strict';

export const CONFIG = {
    wrongFlagHint: {
        width: 5,
        padding: 8,
        opacity: 0.7
    },
    shadowLinePadding: 3,
    detectedMineTarget: {
        left: {
            sAngle: 0.5 * Math.PI,
            eAngle: 1.5 * Math.PI,
            radius: 12
        },
        right: {
            sAngle: 1.5 * Math.PI,
            eAngle: 0.5 * Math.PI,
            radius: 12
        }
    },
    targetLine: {
        width: 2,
        padding: 3,
        size: 4
    }
};