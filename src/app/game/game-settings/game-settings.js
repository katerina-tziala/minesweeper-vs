'use strict';
import './game-settings.scss';
import { ElementGenerator, ButtonGenerator, ElementHandler } from 'UI_ELEMENTS';
import { DOM_ELEMENT_CLASS, LABELS } from './game-settings.constants';


export class GameSettings {
    #settings;
    #inputHandlers;

    constructor() {
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
        if (this.#inputHandlers && name && element) {
            this.#inputHandlers.set(name, element);
        }
    }

    getInputField(name) {
      return this.#inputHandlers ? this.#inputHandlers.get(name) : undefined;
    }

    initInputHandlers() {
        this.#inputHandlers = new Map();
    }

    generateSettingContainer(name, inputId) {
        const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.setting]);
        const label = this.#generateSettingLabel(name, inputId);
        container.append(label);
        return container;
    }

    #generateSettingLabel(name, inputId) {
        return ElementGenerator.generateLabel(LABELS[name], inputId);
    }

    #generateInput(type, name, action) {
        const input = document.createElement(type);
        input.setAttribute('name', name);
        this.setInputListener(input, action);
        return input;
    }

    setInputListener(input, action) {
        if (input && action) {
            input.addEventListener("onValueChange", action);
        }
    }

    removeInputListener(input, action) {
        if (input && action) {
            input.removeEventListener("onValueChange", action);
        }
    }

    generateInputs() {
        const fragment = document.createDocumentFragment();
        for (const [name, input] of this.#inputHandlers) {
            const container = this.generateSettingContainer(name, name);
            container.append(input);
            fragment.append(container);
        }
        return fragment;
    }

    generateNumberInput(name, action) {
        return this.#generateInput('app-number-input', name, action);
    }

    generateSelectInput(name, action) {
        return this.#generateInput('app-dropdown-select', name, action);
    }

    setInputDisabled(input, disabled = false) {
        if (input) {
            input.setAttribute('disabled', disabled);
        }
    }

    setInputValue(input, value) {
        if (input) {
            input.setAttribute('value', value);
        }
    }

    setNumberInputBoundaries(input, boundaries = {}) {
        const { min, max } = boundaries;
        if (input) {
            input.setAttribute('min', min ? min : '');
            input.setAttribute('max', max ? max : '');
        }
    }

}
