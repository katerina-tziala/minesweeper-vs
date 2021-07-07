'use strict';
export const COUNTER_CONFIG = {
    min: -99,
    max: 999,
    value: 0
};

export const DOM_ELEMENT_CLASS = {
    icon: 'flags-counter-icon',
    flag: 'flags-counter__flag'
};

export const ATTRIBUTES = {
    flags: 'flags',
    colorTypes: 'color-types'
};

export const TEMPLATES = {
    iconHolder: `<div class='${DOM_ELEMENT_CLASS.icon}'></div>`,
    flag: `<div class='${DOM_ELEMENT_CLASS.flag}'></div>`,

};