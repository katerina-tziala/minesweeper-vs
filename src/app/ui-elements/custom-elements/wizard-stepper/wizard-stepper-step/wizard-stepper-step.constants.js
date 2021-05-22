export const DOM_ELEMENT_CLASS = {
    indicator: 'wizard-step-indicator',
    label: 'wizard-step-label'
};

export const ATTRIBUTES = {
    name: 'name',
    selected: 'selected',
    visited: 'visited',
    disabled: 'disabled'
};

export const TEMPLATE = `
<span class='${DOM_ELEMENT_CLASS.indicator}'></span>
<span class='${DOM_ELEMENT_CLASS.label}'>%name%</span>
`;

export const TEXT = {
    bot: 'bot',
    gameMode: 'vs mode',
    level: 'level',
    turns: 'turns',
    options: 'options'
};