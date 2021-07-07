'use strict';
export const DOM_ELEMENT_CLASS = {
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    timeSeparator: 'time-separator',
    alive: 'time-separator--blink'
};

export const CONFIG = {
    supportedFormats: ['h:m:s', 'm:s'],
    widthBase: 60,
};

export const ATTRIBUTES = {
    format: 'format',
    seconds: 'seconds',
    alive: 'alive'
};

export const TEMPLATES = {
    'h': `<app-digital-counter class='${DOM_ELEMENT_CLASS.hours}' min='0' max='23' value='0'></app-digital-counter>`,
    'm': `<app-digital-counter class='${DOM_ELEMENT_CLASS.minutes}' min='0' max='59' value='0'></app-digital-counter>`,
    's': `<app-digital-counter class='${DOM_ELEMENT_CLASS.seconds}' min='0' max='59' value='0'></app-digital-counter>`,
    'separator': `<div class='${DOM_ELEMENT_CLASS.timeSeparator}'></div>`
};
