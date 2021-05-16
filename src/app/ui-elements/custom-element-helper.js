'use strict';

export class CustomElementHelper {

    static generateInput(type, name, action) {
        const input = document.createElement(type);
        input.setAttribute('name', name);
        CustomElementHelper.setInputListener(input, action);
        return input;
    }

    static generateNumberInput(name, action) {
        return CustomElementHelper.generateInput('app-number-input', name, action);
    }

    static generateSelectInput(name, action) {
        return CustomElementHelper.generateInput('app-dropdown-select', name, action);
    }

    static generateSwitcherInput(name, action) {
        return CustomElementHelper.generateInput('app-switcher', name, action);
    }

    static setInputListener(input, action) {
        if (input && action) {
            input.addEventListener("onValueChange", action);
        }
    }

    static removeInputListener(input, action) {
        if (input && action) {
            input.removeEventListener("onValueChange", action);
        }
    }

    static setInputDisabled(input, disabled = false) {
        if (input) {
            input.setAttribute('disabled', disabled);
        }
    }

    static setInputValue(input, value = '') {
        if (input) {
            input.setAttribute('value', value);
        }
    }

    static setInputChecked(input, checked = false) {
        if (input) {
            input.setAttribute('checked', checked);
        }
    }

    static setNumberInputBoundaries(input, boundaries = {}) {
        const { min, max } = boundaries;
        if (input) {
            input.setAttribute('min', min ? min : '');
            input.setAttribute('max', max ? max : '');
        }
    }

}
