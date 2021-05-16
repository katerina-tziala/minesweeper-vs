'use strict';
import { SETTINGS_PROPERTIES, MODE_PROPERTIES, STRATEGY_DEPENDED_PROPERTIES } from './options-settings.constants';
import { DEFAULT_SETTINGS, DEFAULT_SETTINGS_NO_FLAGGING } from './options-settings-config';
import GameSettings from '../game-settings';
import { GameMode } from 'GAME_ENUMS';
import { valueDefined } from 'UTILS';

export class OptionsSettings extends GameSettings {
    #gameMode;
    #defaultSettings;
    #properties;
    #strategyDependedProperties;
    #customSettings;
    // GameMode.Original
    constructor(gameMode = GameMode.Clear) {
        super();

        this.#gameMode = gameMode;
        this.#defaultSettings = DEFAULT_SETTINGS[this.#gameMode];
        this.#properties = MODE_PROPERTIES[this.#gameMode];

        this.#strategyDependedProperties = STRATEGY_DEPENDED_PROPERTIES;

        this.inputListeners.set(SETTINGS_PROPERTIES.marks, this.onPropertyChange.bind(this));
        this.inputListeners.set(SETTINGS_PROPERTIES.misplacedFlagHint, this.onPropertyChange.bind(this));
        this.inputListeners.set(SETTINGS_PROPERTIES.revealing, this.onPropertyChange.bind(this));
        this.inputListeners.set(SETTINGS_PROPERTIES.unlimitedFlags, this.onPropertyChange.bind(this));
        this.inputListeners.set(SETTINGS_PROPERTIES.identicalMines, this.onPropertyChange.bind(this));


        this.inputListeners.set(SETTINGS_PROPERTIES.openStrategy, this.#onSneakPeekManagerChange.bind(this));
        this.inputListeners.set(SETTINGS_PROPERTIES.openCompetition, this.#onSneakPeekManagerChange.bind(this));

        this.inputListeners.set(SETTINGS_PROPERTIES.flagging, this.#onFlaggingChange.bind(this));

    }

    get #strategyAllowed() {
        return valueDefined(this.settings.flagging) ? this.settings.flagging : true;
    }

    initInputHandlers() {
        super.initInputHandlers();
        this.setSwitcherHandlers(this.#properties);
    }

    render() {
        this.initInputHandlers();
        return super.render('options');
    }

    init(settings) {
        this.#setSettings(settings);
        this.initFields();
    }

    #setSettings(settings) {
        this.settings = settings || { ...this.#defaultSettings };
        if (!this.#strategyAllowed) {
            this.settings = { ...DEFAULT_SETTINGS_NO_FLAGGING };
        }
        this.#customSettings = undefined;
    }

    initFields(properties = this.#properties) {
        properties.forEach(type => this.resetSwitcherField(type, !this.#strategyAllowed));
        this.#checkSneakPeekSetting();
    }

    #onSneakPeekManagerChange({ detail }) {
        this.updateSettings(detail);
        this.#checkSneakPeekSetting();
    }

    #onFlaggingChange({ detail }) {
        const { value } = detail;
        if (!value) {
            this.#customSettings = { ...this.settings };
            this.#customSettings.flagging = true;
            this.settings = { ...DEFAULT_SETTINGS_NO_FLAGGING };
        } else {
            this.#setSettings(this.#customSettings);
        }
        this.initFields(this.#strategyDependedProperties);
        this.#checkSneakPeekSetting();
    }

    #checkSneakPeekSetting() {
        console.log('strategyAllowed ', this.#strategyAllowed);
        console.log(this.settings);
        
        // check Sneak Peek 
    }

}
