'use strict';
import GameSettings from '../game-settings';

export class OptionsSettings extends GameSettings {

    constructor() {
        super();
        this.properties = [];
        this.defaultSettings = {};
    }

    get strategyAllowed() {
        return true;
    }

    initInputListeners(properties = this.properties) {
        properties.forEach(type => {
            this.inputListeners.set(type, this.onPropertyChange.bind(this));
        });
    }

    render() {
        this.initInputHandlers();
        return super.render('options');
    }

    init(settings) {
        this.setSettings(settings);
        this.initFields();
    }

    setSettings(settings) {
        this.settings = { ...this.defaultSettings };
        if (settings) {
            this.settings = Object.assign({ ...this.settings }, settings);
        }
    }

    initFields(properties = this.properties) {
        properties.forEach(type => this.resetSwitcherField(type, !this.strategyAllowed));
    }

}
