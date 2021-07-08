'use strict';
export const DOM_ELEMENT_CLASS = {
    minefield: 'board-minefield',
    boardInfo: 'board-info',
    timerContainer: 'board-info-timer-container',
    flagsContainer: 'board-info-flags-container'
};

export const ATTRIBUTES = {

};


export const TEMPLATE = `
<div class='${DOM_ELEMENT_CLASS.boardInfo}'>
    <div class='${DOM_ELEMENT_CLASS.timerContainer}'>
        <app-game-timer turn-duration='%turnDuration%'></app-game-timer>
    </div>
    <app-board-face state='smile'></app-board-face>
     <div class='${DOM_ELEMENT_CLASS.flagsContainer}'>
        <app-flags-counter flags='%flagTypes%' color-types='%flagColors%'></app-flags-counter>
    </div>
</div>
<div class='${DOM_ELEMENT_CLASS.minefield}'>
    <app-minefield rows='%rows%' columns='%columns%' revealing='%revealing%' flagging='%flagging%' 
    wrong-flag-hint='%misplacedFlagHint%' disabled='%disabled%' theme='%theme%' mine-type='%mineType%'></app-minefield>
</div>
`;


{/* <app-game-timer turn-duration='0'></app-game-timer>

<app-flags-counter flags='checkered' color-types='type-2'></app-flags-counter> */}