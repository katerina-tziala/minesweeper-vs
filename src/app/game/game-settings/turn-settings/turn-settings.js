'use strict';
import { SETTINGS_PROPERTIES } from './turn-settings.constants';
import { DEFAULT_SETTINGS, DEFAULT_SETTINGS_OFF, BOUNDARIES } from './turn-settings-config';
import GameSettings from '../game-settings';

export class TurnSettings extends GameSettings {
    #numberInputTypes;
    #customSettings;

    constructor() {
        super();
        this.#numberInputTypes = [SETTINGS_PROPERTIES.turnDuration, SETTINGS_PROPERTIES.missedTurnsLimit];
        this.inputListeners.set(SETTINGS_PROPERTIES.turnTimer, this.#onTimerChange.bind(this));
        this.inputListeners.set(SETTINGS_PROPERTIES.turnDuration, this.onPropertyChange.bind(this));
        this.inputListeners.set(SETTINGS_PROPERTIES.missedTurnsLimit, this.onPropertyChange.bind(this));
        this.inputListeners.set(SETTINGS_PROPERTIES.consecutiveTurns, this.onPropertyChange.bind(this));
        this.initInputHandlers();
    }

    get #turnTimerSelected() {
        return this.settings ? this.settings.turnTimer : false;
    }

    initInputHandlers() {
        super.initInputHandlers();
        this.setSwitcherHandlers([SETTINGS_PROPERTIES.turnTimer]);
        this.setNumberFieldsHandlers(this.#numberInputTypes);
        this.setSwitcherHandlers([SETTINGS_PROPERTIES.consecutiveTurns]);
    }

    render() {
        return super.render('turns');
    }

    init(settings) {
        this.#setSettings(settings);
        this.resetSwitcherField(SETTINGS_PROPERTIES.turnTimer, false);
        this.#initNumberFields();
        this.resetSwitcherField(SETTINGS_PROPERTIES.consecutiveTurns, !this.#turnTimerSelected);
    }

    #setSettings(settings) {
        this.settings = settings || { ...DEFAULT_SETTINGS };
        if (!this.#turnTimerSelected) {
            this.settings = { ...DEFAULT_SETTINGS_OFF };
        }
        this.#customSettings = undefined;
    }

    #onTimerChange({ detail }) {
        this.updateSettings(detail);
        if (!this.#turnTimerSelected) {
            this.#customSettings = { ...this.settings };
            this.#customSettings.turnTimer = true;
            this.settings = { ...DEFAULT_SETTINGS_OFF };
        } else {
            this.#setSettings(this.#customSettings);
        }
        this.#initNumberFields();
        this.resetSwitcherField(SETTINGS_PROPERTIES.consecutiveTurns, !this.#turnTimerSelected);
    }

    #initNumberFields() {
        const disabled = !this.#turnTimerSelected;
        this.#numberInputTypes.forEach(type => {
            const boundaries = disabled ? BOUNDARIES.off : BOUNDARIES[type];
            this.resetNumberField(type, disabled, boundaries)
        });
    }

}
