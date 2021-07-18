'use strict';
export const DOM_ELEMENT_CLASS = {
    flagsNumber: 'placed-flags__number',
    infinite: 'placed-flags__infinite',
};

export const ATTRIBUTES = {
    value: 'value'
};

export const TEMPLATE = `
    <div class='${DOM_ELEMENT_CLASS.flagsNumber}'></div>
`;

export const TEMPLATES = {
    flagsNumber: `<div class='${DOM_ELEMENT_CLASS.flagsNumber}'></div>`,
    infinite: `<div class='${DOM_ELEMENT_CLASS.infinite}'>&infin;</div>`,
    
};
