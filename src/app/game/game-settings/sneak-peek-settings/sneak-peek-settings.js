'use strict';
import { SETTINGS_PROPERTIES, DEFAULT_SETTINGS, BOUNDARIES } from './sneak-peek-settings-constants';
import GameSettings from '../game-settings';
import { GameSettingsElementHelper as ElementHandler } from '../game-settings-element-helper';

export class SneakPeekSettings extends GameSettings {
    #currentSettings;
    #onUpdate;
    #turnDuration;

    constructor(onUpdate) {
        super();
        this.#onUpdate = onUpdate;
        this.inputListeners.set(SETTINGS_PROPERTIES.sneakPeek, this.#onSneakPeekChange.bind(this));
        this.inputListeners.set(SETTINGS_PROPERTIES.sneakPeekDuration, this.#onSneakPeekDurationChange.bind(this));
    }

    get #settingsInProgress() {
        const settings = this.#currentSettings ? { ...this.#currentSettings } : { ...this.settings };
        return settings;
    }

    get #durationBoundaries() {
        const boundaries = this.settings.sneakPeek ? { ...BOUNDARIES } : undefined;
        if (boundaries && this.#turnDuration) {
            boundaries.max = this.#turnDuration;
        }
        return boundaries;
    }

    initInputHandlers() {
        super.initInputHandlers();
        this.setSwitcher(SETTINGS_PROPERTIES.sneakPeek);
        this.setNumberFieldsHandlers([SETTINGS_PROPERTIES.sneakPeekDuration]);
    }

    render() {
        this.initInputHandlers();
        return this.generateInputs();
    }

    init(settings, allowed = false, turnDuration) {
        this.#turnDuration = turnDuration;
        if (this.settings && this.settings.sneakPeek) {
            this.#currentSettings = { ...this.settings };
        }
        this.#setSettings(settings);
        allowed ? this.#enable() : this.#disable();
        this.#submitUpdate();
    }

    #disable() {
        this.#setSettings({ ...DEFAULT_SETTINGS });
        this.resetSwitcherField(SETTINGS_PROPERTIES.sneakPeek, true);
        this.resetNumberField(SETTINGS_PROPERTIES.sneakPeekDuration, true);
    }

    #enable() {
        this.#setSettings(this.#settingsInProgress);
        this.resetSwitcherField(SETTINGS_PROPERTIES.sneakPeek, false);
        this.#checkDuration();
    }

    #setSettings(settings) {
        this.settings = { ...settings } || { ...DEFAULT_SETTINGS };
        if (this.settings && !this.settings.sneakPeek) {
            this.settings.sneakPeekDuration = 0;
        }
    }

    #onSneakPeekChange({ detail }) {
        const { value } = detail;
        if (!value) {
            this.#currentSettings = { ...this.settings };
            this.updateSettings(detail);
            this.settings.sneakPeekDuration = 0;
        } else {
            const settings = this.#settingsInProgress;
            settings.sneakPeek = true;
            this.#setSettings(settings);
            this.#currentSettings = undefined;
        }
        this.#submitUpdate();
        this.#checkDuration();
    }

    #onSneakPeekDurationChange({ detail }) {
        this.updateSettings(detail);
        this.#submitUpdate();
    }

    #checkDuration() {
        const disabled = !this.settings.sneakPeek;
        this.resetNumberField(SETTINGS_PROPERTIES.sneakPeekDuration, disabled);
        const input = this.getInputField(SETTINGS_PROPERTIES.sneakPeekDuration);
        ElementHandler.setNumberInputBoundaries(input, this.#durationBoundaries);
    }

    #submitUpdate() {
        if (this.#onUpdate) {
            this.#onUpdate(this.settings);
        }
    }

}
