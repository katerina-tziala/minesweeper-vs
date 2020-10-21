'use strict';

import { TYPOGRAPHY } from '../../../utilities/constants/typography.constants';
import { ElementGenerator } from '../../../utilities/element-generator';
import { Validator } from '../../../utilities/validator';
import { preventInteraction, clone, replaceStringParameter } from '../../../utilities/utils';

import { DOM_ELEMENT_CLASS, FIELD_PARAMS, FIELD_ERROR } from './text-input.constants';

import { UserInput } from '../user-input';
import { InputError } from '../input-error/input-error';

import './text-input.scss';

export class TextInput extends UserInput {
    #errorController;

    constructor(name, onValueChange) {
        super(name, TYPOGRAPHY.emptyString, onValueChange);
        this.errorController = new InputError(this.name);
    }

    set errorController(errorController) {
        this.#errorController = errorController;
    }

    get errorController() {
        return this.#errorController;
    }

    get inputClassBasedOnName() {
        return DOM_ELEMENT_CLASS.inputField + TYPOGRAPHY.doubleHyphen + this.name;
    }

    get inputParams() {
        const params = clone(FIELD_PARAMS);
        params.ariaLabel = replaceStringParameter(params.ariaLabel, this.name);
        params.placeholder = replaceStringParameter(params.placeholder, this.name);
        params.className = `${DOM_ELEMENT_CLASS.inputField} ${this.inputClassBasedOnName}`;
        params.autocomplete = 'off';
        params.id = this.name;
        return params;
    }

    get inputError() {
        return replaceStringParameter(FIELD_ERROR, this.name);
    }

    generateInput() {
        const inputContainer = ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.inputContainer);
        const input = this.generateInputField(this.onValueChange.bind(this));
        const error = this.errorController.generateInputError();
        inputContainer.append(input, error);
        return inputContainer;
    }

    onValueChange(event) {
        preventInteraction(event);
        this.value = event.target.value;
        this.validateValue();
    }

    validateValue() {
        if (this.value.length === 0) {
            this.errorController.hide();
            this.valid = false;
            this.notifyForChanges();
            return;
        }
        const trimmedValue = this.value.trim();
        if (!Validator.isEmptyString(trimmedValue) && trimmedValue.length > 1) {
            this.value = trimmedValue;
            this.errorController.hide();
            this.valid = true;
            this.notifyForChanges();
            return;
        }
        this.valid = false;
        this.errorController.show(this.inputError);
        this.notifyForChanges();
    }

    showInputError(message = this.inputError) {
        this.errorController.show(message);
    }

    clear() {
        this.value = TYPOGRAPHY.emptyString;
        this.inputField.then(inputField => inputField.value = this.value);
        this.valid = false;
        this.errorController.hide();
    }

}
