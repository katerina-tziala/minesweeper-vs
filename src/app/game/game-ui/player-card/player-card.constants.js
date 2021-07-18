'use strict';
export const DOM_ELEMENT_CLASS = {
    playerContainer: 'player-card__player-container'
};

export const ATTRIBUTES = {

};

export const TEMPLATE = `
<div class='${DOM_ELEMENT_CLASS.playerContainer}'>
    <app-player-turns direction='rtl' turns=10></app-player-turns>
    <app-avatar></app-avatar>
</div>
`;
