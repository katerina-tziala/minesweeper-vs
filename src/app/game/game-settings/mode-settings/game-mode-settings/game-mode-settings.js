'use strict';
import { ARIA, DISPLAY_VALUES, EXPLANATION } from './game-mode-settings.constants';
import { GameMode } from 'GAME_ENUMS';
import { ModeSettings } from '../mode-settings';

export class GameModeSettings extends ModeSettings {

    constructor(excludeParallel = false) {
        super();
        this.enumSelection = this.#getAllowedModes(excludeParallel);
        this.fieldName = 'gameMode';
        this.sectionName = 'vsMode';
        this.ariaLabels = ARIA;
        this.displayValues = DISPLAY_VALUES;
        this.defaultSettings = this.#getDefaultSettings(this.enumSelection);
        this.inputListeners.set(this.fieldName, this.#getGameModeChange.bind(this));
    }

    get explanationContent() {
        return `<span>${EXPLANATION[this.selectedValue]}</span>`;
    }

    #getAllowedModes(excludeParallel) {
        const { Clear, Detect, Parallel } = GameMode;
        if (excludeParallel) {
            return { Clear, Detect };
        }
        return { Clear, Detect, Parallel };
    }

    #getDefaultSettings(enumSelection) {
        const availableValues = Object.values({ ...enumSelection });
        const gameMode = availableValues[0];
        return { gameMode };
    }

    #getGameModeChange({ detail }) {
        this.updateSettings(detail);
        this.setExplanation();
    }

}
