export const DOM_ELEMENT_CLASS = {
    minefield: 'minefield'
};

export const ATTRIBUTES = {
    rows: 'rows',
    columns: 'columns',
    disabled: 'disabled',
    revealing: 'revealing',
    flagging: 'flagging',
    wrongFlagHint: 'wrong-flag-hint',
    theme: 'theme',
    mineType: 'mine-type'
};

export const TEMPLATE = `
<canvas class='${DOM_ELEMENT_CLASS.minefield}' width=0 height=0 style='font-family: Nunito'></canvas>
`;
