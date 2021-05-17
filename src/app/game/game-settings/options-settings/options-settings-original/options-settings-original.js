'use strict';
import { DEFAULT_SETTINGS, MODE_PROPERTIES } from './options-settings-original.constants';
import { OptionsSettings } from '../options-settings';

export class OptionsSettingsOriginal extends OptionsSettings {

    constructor() {
        super();
        this.properties = MODE_PROPERTIES;
        this.defaultSettings = { ...DEFAULT_SETTINGS };
        this.initInputListeners();
    }

    initInputHandlers() {
        super.initInputHandlers();
        this.setSwitcherHandlers(this.properties);
    }
}
