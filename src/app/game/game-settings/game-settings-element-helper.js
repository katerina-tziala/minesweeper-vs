'use strict';
import { ElementGenerator, ElementHandler, CustomElementHelper } from 'UI_ELEMENTS';
import { DOM_ELEMENT_CLASS, LABELS, HEADERS } from './game-settings.constants';

export class GameSettingsElementHelper {

    static generateHeader(type) {
        const header = document.createElement('h2');
        ElementHandler.setStyleClass(header, [DOM_ELEMENT_CLASS.header, type]);
        ElementHandler.setContent(header, HEADERS[type]);
        return header;
    }

    static generateSettingContainer(name, inputId) {
        const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.setting]);
        const label = GameSettingsElementHelper.generateSettingLabel(name, inputId);
        container.append(label);
        return container;
    }

    static generateSettingLabel(name, inputId) {
        return ElementGenerator.generateLabel(LABELS[name], inputId);
    }

    static generateNumberInput(name, action) {
        return CustomElementHelper.generateNumberInput(name, action);
    }

    static generateSelectInput(name, action) {
        return CustomElementHelper.generateSelectInput(name, action);
    }

    static generateSwitcherInput(name, action) {
        return CustomElementHelper.generateSwitcherInput(name, action);
    }

    static setInputListener(input, action) {
        CustomElementHelper.setInputListener(input, action);
    }

    static removeInputListener(input, action) {
        CustomElementHelper.removeInputListener(input, action);
    }

    static setInputDisabled(input, disabled) {
        CustomElementHelper.setInputDisabled(input, disabled);
    }

    static setInputValue(input, value) {
        CustomElementHelper.setInputValue(input, value);
    }

    static setInputChecked(input, checked) {
        CustomElementHelper.setInputChecked(input, checked);
    }

    static setNumberInputBoundaries(input, boundaries) {
        CustomElementHelper.setNumberInputBoundaries(input, boundaries);
    }

}
