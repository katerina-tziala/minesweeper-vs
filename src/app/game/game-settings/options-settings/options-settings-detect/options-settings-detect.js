'use strict';
import { DEFAULT_SETTINGS, MODE_PROPERTIES } from './options-settings-detect.constants';
import { OptionsSettings } from '../options-settings';

export class OptionsSettingsDetect extends OptionsSettings {

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
