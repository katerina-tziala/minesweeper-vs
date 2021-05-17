'use strict';
import './game-settings.scss';
import { GameSettingsElementHelper as ElementHandler } from './game-settings-element-helper';

export default class GameSettings {
    #settings;
    #inputHandlers;
    inputListeners;

    constructor() {
        this.inputListeners = new Map();
    }

    get settings() {
        return this.#settings;
    }

    set settings(settings) {
        this.#settings = settings;
    }

    get inputHandlers() {
        return this.#inputHandlers;
    }

    setInputHandler(name, element) {
        if (name && element) {
            this.#inputHandlers.set(name, element);
        }
    }

    getInputField(name) {
        return this.#inputHandlers ? this.#inputHandlers.get(name) : undefined;
    }

    initInputHandlers() {
        this.#inputHandlers = new Map();
    }

    setNumberFieldsHandlers(fieldNames) {
        fieldNames.forEach(type => {
            const input = ElementHandler.generateNumberInput(type);
            this.setInputHandler(type, input);
        });
    }

    setSwitcherHandlers(fieldNames) {
        fieldNames.forEach(type => this.setSwitcher(type));
    }

    setSwitcher(type) {
        const input = ElementHandler.generateSwitcherInput(type);
        this.setInputHandler(type, input);
    }

    setSelectFieldsHandlers(fieldNames) {
        fieldNames.forEach(type => {
            const input = ElementHandler.generateSelectInput(type);
            this.setInputHandler(type, input);
        });
    }

    render(type) {
        const fragment = document.createDocumentFragment();
        const header = ElementHandler.generateHeader(type);
        const inputs = this.generateInputs();
        fragment.append(header, inputs);
        return fragment;
    }

    generateInputs() {
        const fragment = document.createDocumentFragment();
        for (const [name, input] of this.#inputHandlers) {
            const container = ElementHandler.generateSettingContainer(name, name);
            container.append(input);
            fragment.append(container);
        }
        return fragment;
    }

    removeInputListener(type) {
        const input = this.getInputField(type);
        const action = this.inputListeners.get(type);
        ElementHandler.removeInputListener(input, action);
    }

    setInputListener(type, disabled = false) {
        if (!disabled) {
            const input = this.getInputField(type);
            const action = this.inputListeners.get(type);
            ElementHandler.setInputListener(input, action);
        }
    }

    resetSwitcherField(type, disabled) {
        this.removeInputListener(type);
        const input = this.getInputField(type);
        ElementHandler.setInputDisabled(input, disabled);
        ElementHandler.setInputChecked(input, this.settings[type]);
        this.setInputListener(type, disabled);
    }

    resetNumberField(type, disabled, boundaries) {
        this.removeInputListener(type);
        const input = this.getInputField(type);
        ElementHandler.setInputDisabled(input, disabled);
        ElementHandler.setInputValue(input, this.settings[type]);
        ElementHandler.setNumberInputBoundaries(input, boundaries);
        this.setInputListener(type, disabled);
    }

    resetSelectField(type, disabled, options) {
        this.removeInputListener(type);
        const input = this.getInputField(type);
        ElementHandler.setInputDisabled(input, disabled);
        input.setOptions(options);
        this.setInputListener(type, disabled);
    }

    updateSettings({ name, value }) {
        const settings = { ...this.settings };
        settings[name] = value;
        this.settings = settings;
    }

    onPropertyChange({ detail }) {
        console.log(detail);
        this.updateSettings(detail);
    }
}
