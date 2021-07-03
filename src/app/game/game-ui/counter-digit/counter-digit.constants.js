export const CONFIG = {
    width: 26,
    height: 38,
    lineChange: 4,
    lineThickness: 4,
    lineSize: 14,
    padding: 4,
    middleLeftSpace: 2,
    topSpace: 1,
    lineShadow: {
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 3
    }
};

export const DIGIT_POSITIONS = {
    '0': [1, 2, 3, 4, 5, 6],
    '1': [3, 4],
    '2': [2, 3, 5, 6, 7],
    '3': [2, 3, 4, 5, 7],
    '4': [1, 3, 4, 7],
    '5': [1, 2, 4, 5, 7],
    '6': [1, 2, 4, 5, 6, 7],
    '7': [2, 3, 4],
    '8': [1, 2, 3, 4, 5, 6, 7],
    '9': [1, 2, 3, 4, 5, 7],
    'minus': [7],
    'above-max': [2, 3],
    'bellow-min': [5, 6],
};


export const DOM_ELEMENT_CLASS = {
    digit: 'counter-digit-canvas'
};

export const ATTRIBUTES = {
    value: 'value'
};

export const TEMPLATE = `
<canvas class='${DOM_ELEMENT_CLASS.digit}' width=${CONFIG.width} height=${CONFIG.height}></canvas>
`;
