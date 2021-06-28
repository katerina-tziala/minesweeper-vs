export const DOM_ELEMENT_CLASS = {
    button: 'board-face-button',
    icon: 'board-face-icon',
    player: 'board-face-icon--player'
};

export const ATTRIBUTES = {
    disabled: 'disabled',
    color: 'color'
};

export const TEMPLATE = `
    <button class='${DOM_ELEMENT_CLASS.button}'>
        <span class='${DOM_ELEMENT_CLASS.icon}'></span>
    </button>
`;
