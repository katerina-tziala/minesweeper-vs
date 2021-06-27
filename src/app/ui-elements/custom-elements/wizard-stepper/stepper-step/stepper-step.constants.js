export const DOM_ELEMENT_CLASS = {
    indicator: 'step-indicator',
    label: 'step-label'
};

export const ATTRIBUTES = {
    name: 'name',
    selected: 'selected',
    visited: 'visited',
    disabled: 'disabled'
};

export const TEMPLATE = `
<div class='${DOM_ELEMENT_CLASS.indicator}'></div>
<div class='${DOM_ELEMENT_CLASS.label}'>%name%</div>
`;

export const TEXT = {
    bot: 'bot',
    mode: 'vs mode',
    level: 'level',
    turns: 'turns',
    options: 'options'
};