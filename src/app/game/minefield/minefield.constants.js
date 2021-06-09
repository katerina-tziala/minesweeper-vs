export const DOM_ELEMENT_CLASS = {
    minefield: 'minefield'
};

export const ATTRIBUTES = {
    rows: 'rows',
    columns: 'columns',
    mines: 'mines'
};

export const TEMPLATE = `
<canvas class='${DOM_ELEMENT_CLASS.minefield}' width=0 height=0 style="font-family: Nunito"></canvas>
`;
