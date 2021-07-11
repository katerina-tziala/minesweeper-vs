'use strict';
export const DOM_ELEMENT_CLASS = {
    board: 'game-board',
    minefield: 'board-minefield',
    boardInfo: 'board-info',
    timerContainer: 'board-info-timer-container',
    flagsContainer: 'board-info-flags-container'
};

export const TEMPLATES = {
    minefield: `<div class='${DOM_ELEMENT_CLASS.minefield}'>
    <app-minefield rows='%rows%' columns='%columns%' revealing='%revealing%' flagging='%flagging%' 
    wrong-flag-hint='%misplacedFlagHint%' disabled='true' theme='%theme%' mine-type='%mineType%'></app-minefield>
    </div>`,
    boardFace: `<app-board-face state='smile'></app-board-face>`,
    flagsCounter: `<div class='${DOM_ELEMENT_CLASS.flagsContainer}'>
    <app-flags-counter flags='%flagTypes%' color-types='%flagColors%'></app-flags-counter>
    </div>`,
    gameTimer: `<div class='${DOM_ELEMENT_CLASS.timerContainer}'>
        <app-game-timer turn-duration='%turnDuration%'></app-game-timer>
    </div>`,
};