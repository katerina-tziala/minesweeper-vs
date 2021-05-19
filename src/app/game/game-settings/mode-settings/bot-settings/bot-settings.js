'use strict';
import { ARIA, DISPLAY_VALUES, EXPLANATION } from './bot-settings.constants';
import { BotMode } from 'GAME_ENUMS';
import { ModeSettings } from '../mode-settings';

export class BotSettings extends ModeSettings {

    constructor() {
        super();
        this.enumSelection = BotMode;
        this.fieldName = 'botLevel';
        this.sectionName = 'bot';
        this.defaultSettings = { botLevel: BotMode.Easy };
        this.ariaLabels = ARIA;
        this.displayValues = DISPLAY_VALUES;
        this.inputListeners.set(this.fieldName, this.onPropertyChange.bind(this));
    }

    get explanationContent() {
        return `<span>${EXPLANATION}</span>`;
    }

}
