'use strict';
import { DEFAULT_SETTINGS, MODE_PROPERTIES } from './options-settings-parallel.constants';
import { OptionsSettings } from '../options-settings';
import { SneakPeekSettings } from '../../sneak-peek-settings/sneak-peek-settings';

export class OptionsSettingsParallel extends OptionsSettings {
    #sneakPeekHandler;

    constructor() {
        super();
        this.properties = MODE_PROPERTIES;
        this.defaultSettings = { ...DEFAULT_SETTINGS };
        this.initInputListeners();
        this.inputListeners.set('openCompetition', this.#onOpenCompetitionChange.bind(this));
        this.#sneakPeekHandler = new SneakPeekSettings(this.#onSneakPeekUpdate.bind(this));
    }

    initInputHandlers() {
        super.initInputHandlers();
        this.setSwitcherHandlers(this.properties);
        this.setSwitcher('openCompetition');
    }

    render() {
        const options = super.render('options');
        options.append(this.#sneakPeekHandler.render());
        return options;
    }

    initFields() {
        super.initFields();
        this.resetSwitcherField('openCompetition', !this.strategyAllowed);
        this.#initSneakPeek();
    }

    #onOpenCompetitionChange({ detail }) {
        this.updateSettings(detail);
        this.#initSneakPeek();
    }

    #initSneakPeek() {
        const { sneakPeek, sneakPeekDuration } = this.settings;
        this.#sneakPeekHandler.init({ sneakPeek, sneakPeekDuration }, !this.settings.openCompetition);
    }

    #onSneakPeekUpdate(sneakPeekSettings) {
        this.settings = Object.assign(this.settings, sneakPeekSettings);
    }
}
