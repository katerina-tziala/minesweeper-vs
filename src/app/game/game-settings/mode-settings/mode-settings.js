'use strict';
import GameSettings from '../game-settings';
import { GameSettingsElementHelper as ElementHandler } from '../game-settings-element-helper';

export class ModeSettings extends GameSettings {

    constructor() {
        super();
    }

    get selectedValue() {
        return this.settings ? this.settings[this.fieldName] : this.defaultSettings[this.fieldName];
    }

    get options() {
        return Object.keys(this.enumSelection).map(key => {
            const value = this.enumSelection[key];
            const selected = value === this.selectedValue;
            const ariaLabel = this.ariaLabels[value];
            const displayValue = `<span>${this.displayValues[value]}</span>`;
            return { value, selected, ariaLabel, displayValue };
        });
    }

    get explanationContainer() {
        return ElementHandler.getExplanationContainer(this.fieldName);
    }

    get explanationContent() {
        return '';
    }

    render() {
        this.initInputHandlers();
        const content = super.render(this.sectionName);
        const explanation = ElementHandler.generateExplanationContainer(this.fieldName);
        content.append(explanation);
        return content;
    }

    init(settings) {
        this.setSettings(settings);
        this.resetSelectField(this.fieldName, false, this.options);
        this.setExplanation();
    }

    setExplanation() {
        const container = this.explanationContainer;
        if (container) {
            container.innerHTML = this.explanationContent;
        }
    }

    initInputHandlers() {
        super.initInputHandlers();
        this.setSelectFieldsHandlers([this.fieldName]);
    }

    setSettings(settings) {
        this.settings = settings || { ...this.defaultSettings };
    }

}
