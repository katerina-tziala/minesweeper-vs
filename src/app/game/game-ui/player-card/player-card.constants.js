'use strict';
export const DOM_ELEMENT_CLASS = {
    playerContainer: 'player-card__player-container',
    indicators: 'player-card__indicators'
};

export const ATTRIBUTES = {

};

export const TEMPLATE = `
<div class='${DOM_ELEMENT_CLASS.playerContainer}'>
    <app-player-turns direction='rtl' turns=10></app-player-turns>
    <app-avatar type='user'></app-avatar>
</div>
<div class='${DOM_ELEMENT_CLASS.indicators}'>
    <app-placed-flags flag-type="checkered" color-type="type-4" value="3"></app-placed-flags>
    <app-cleared-tiles></app-cleared-tiles>
</div>
`;
