'use strict';
import { DEFAULT_SETTINGS, DEFAULT_SETTINGS_NO_FLAGGING, MODE_PROPERTIES } from './options-settings-clear.constants';
import { OptionsSettings } from '../options-settings';
import { SneakPeekSettings } from '../../sneak-peek-settings/sneak-peek-settings';
import { valueDefined } from 'UTILS';

export class OptionsSettingsClear extends OptionsSettings {
    #sneakPeekHandler;
    #customSettings;
    #turnDuration;

    constructor() {
        super();
        this.properties = MODE_PROPERTIES;
        this.defaultSettings = { ...DEFAULT_SETTINGS };
        this.initInputListeners();
        this.inputListeners.set('flagging', this.#onFlaggingChange.bind(this));
        this.inputListeners.set('openStrategy', this.#onOpenStrategyChange.bind(this));
        this.#sneakPeekHandler = new SneakPeekSettings(this.#onSneakPeekUpdate.bind(this));
    }

    get strategyAllowed() {
        return this.settings && valueDefined(this.settings.flagging) ? this.settings.flagging : false;
    }

    initInputHandlers() {
        super.initInputHandlers();
        this.setSwitcher('flagging');
        this.setSwitcherHandlers(this.properties);
        this.setSwitcher('openStrategy');
    }

    render() {
        const options = super.render('options');
        options.append(this.#sneakPeekHandler.render());
        return options;
    }

    init(settings, turnDuration = 5) {
        this.#turnDuration = turnDuration;
        this.setSettings(settings);
        this.initSettings();
    }

    initSettings() {
        this.resetSwitcherField('flagging', false);
        this.initFields();
        this.resetSwitcherField('openStrategy', !this.strategyAllowed);
        this.#initSneakPeek();
    }

    #initSneakPeek() {
        const { sneakPeek, sneakPeekDuration } = this.settings;
        const allowed = this.strategyAllowed ? !this.settings.openStrategy : false;
        this.#sneakPeekHandler.init({ sneakPeek, sneakPeekDuration }, allowed, this.#turnDuration);
    }

    #onOpenStrategyChange({ detail }) {
        this.updateSettings(detail);
        this.#initSneakPeek();
    }

    #onFlaggingChange({ detail }) {
        const { value } = detail;
        if (!value) {
            this.#customSettings = { ...this.settings };
            this.settings = { ...DEFAULT_SETTINGS_NO_FLAGGING };
        } else {
            this.setSettings(this.#customSettings);
        }
        this.initFields();
        this.resetSwitcherField('openStrategy', !this.strategyAllowed);
        this.#initSneakPeek();
    }

    #onSneakPeekUpdate(sneakPeekSettings) {
        this.settings = Object.assign(this.settings, sneakPeekSettings);
    }
}
