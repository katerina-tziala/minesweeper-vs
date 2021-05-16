'use strict';
import { SETTINGS_PROPERTIES } from './turn-settings.constants';
import { DEFAULT_SETTINGS, DEFAULT_SETTINGS_OFF, BOUNDARIES } from './turn-settings-config';
import GameSettings from '../game-settings';
// import { ElementGenerator, ElementHandler, CustomElementHelper } from 'UI_ELEMENTS';

import { GameSettingsElementHelper as ElementHandler } from '../game-settings-element-helper';



export class TurnSettings extends GameSettings {
    #turnTimer;
    #numberInputTypes;
    #paramListeners;
    #customSettings;

    constructor() {
        super();
        this.#numberInputTypes = [SETTINGS_PROPERTIES.turnDuration, SETTINGS_PROPERTIES.missedTurnsLimit];
        this.#paramListeners = new Map();
        this.#paramListeners.set(SETTINGS_PROPERTIES.turnDuration, this.#onPropertyChange.bind(this));
        this.#paramListeners.set(SETTINGS_PROPERTIES.missedTurnsLimit, this.#onPropertyChange.bind(this));
        this.#paramListeners.set(SETTINGS_PROPERTIES.consecutiveTurns, this.#onPropertyChange.bind(this));
    }

    get #turnTimerSelected() {
        return this.settings ? this.settings.turnTimer : false;
    }


    initInputHandlers() {
        super.initInputHandlers();
        this.#numberInputTypes.forEach(type => {
            const input = ElementHandler.generateNumberInput(type);
            this.setInputHandler(type, input);
        });
        const consecutiveTurns = ElementHandler.generateSwitcherInput(SETTINGS_PROPERTIES.consecutiveTurns);
        this.setInputHandler(SETTINGS_PROPERTIES.consecutiveTurns, consecutiveTurns);
    }

    generateInputs() {
        const timer = this.#generateTimerInput();
        const inputs = super.generateInputs();
        inputs.prepend(timer);
        return inputs;
    }

    render() {
        this.initInputHandlers();
        return super.render('turns');
    }

    init(settings) {
        this.#setSettings(settings);
        if (!this.#turnTimerSelected) {
            this.settings = { ...DEFAULT_SETTINGS_OFF };
            this.#customSettings = undefined;
        }
        this.setInputChecked(this.#turnTimer, this.settings[SETTINGS_PROPERTIES.turnTimer]);
        this.#initNumberFields();
        this.#initSwitcherField();
    }

    #setSettings(settings) {
        this.settings = settings || { ...DEFAULT_SETTINGS };
    }

    #ckeckSettings() {
        if (!this.#turnTimerSelected) {
            this.#customSettings = { ...this.settings };
            this.#customSettings.turnTimer = true;
            this.settings = { ...DEFAULT_SETTINGS_OFF };
        } else {
            this.#setSettings(this.#customSettings);
            this.#customSettings = undefined;
        }
    }

    #generateTimerInput() {
        const container = this.generateSettingContainer(SETTINGS_PROPERTIES.turnTimer);
        this.#turnTimer = ElementHandler.generateSwitcherInput(SETTINGS_PROPERTIES.turnTimer, this.#onTimerChange.bind(this));
        container.append(this.#turnTimer);
        return container;
    }

    #onTimerChange({ detail }) {
        this.updateSettings(detail);
        this.#ckeckSettings();
        this.#initNumberFields();
        this.#initSwitcherField();
    }

    #removeInputAction(input, type, disabled) {
        this.setInputDisabled(input, disabled);
        const action = this.#paramListeners.get(type);
        this.removeInputListener(input, action);
    }

    #resetInputAction(input, type, disabled) {
        if (!disabled) {
            const action = this.#paramListeners.get(type);
            this.setInputListener(input, action);
        }
    }

    #initNumberFields() {
        const disabled = !this.#turnTimerSelected;
        this.#numberInputTypes.forEach(type => {
            const input = this.getInputField(type);
            const value = this.settings[type];
            this.#removeInputAction(input, type, disabled);
            const boundaries = disabled ? BOUNDARIES.off : BOUNDARIES[type];
            this.setNumberInputBoundaries(input, boundaries);
            this.setInputValue(input, value);
            this.#resetInputAction(input, type, disabled);
        });
    }

    #initSwitcherField(type = SETTINGS_PROPERTIES.consecutiveTurns) {
        const disabled = !this.#turnTimerSelected;
        const input = this.getInputField(type);
        const checked = this.settings[type];
        this.#removeInputAction(input, type, disabled);
        this.setInputChecked(input, checked);
        this.#resetInputAction(input, type, disabled);
    }

    #onPropertyChange({ detail }) {
        this.updateSettings(detail);
    }
}
