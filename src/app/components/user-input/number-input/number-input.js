"use strict";

import { TYPOGRAPHY } from "../../../utils/constants/typography.constants";
import { ElementGenerator } from "../../../utils/element-generator";
import { Validator } from "../../../utils/validator";
import { clone, replaceStringParameter } from "../../../utils/utils";

import { DOM_ELEMENT_CLASS, FIELD_PARAMS, FIELD_ERROR } from "./number-input.constants";

import { TextInput } from "../text-input/text-input";
import { InputError } from "../input-error/input-error";

export class NumberInput extends TextInput {

    constructor(name, value = TYPOGRAPHY.emptyString, onValueChange) {
        super(name, value, onValueChange);
        this.valid = this.numberValue !== null ? true : false;
    }

    get inputParams() {
        const params = clone(FIELD_PARAMS);
        params.className = `${DOM_ELEMENT_CLASS.inputField} ${this.inputClassBasedOnName}`;
        params.autocomplete = "off";
        params.attributes["aria-label"] = replaceStringParameter(params.attributes["aria-label"], this.name);
        params.attributes.id = this.name;
        return params;
    }

    get valueInteger() {
        return (this.value.trim().match(/^[0-9]+$/) !== null) ? parseInt(this.value, 10) : undefined;
    }

    get inputError() {
        return replaceStringParameter(FIELD_ERROR, this.name);
    }

    generateInputField() {
        const inputContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.inputContainer]);
        const input = this.generateField(this.onValueChange.bind(this));
        const error = this.errorController.generateInputError();
        inputContainer.append(input, error);
        return inputContainer;
    }



    validateInputTypeValue() {
        const numberValue = this.valueInteger;
        // console.log(this.value);
        // console.log(numberValue);
        // const trimmedValue = this.value.trim();
        // if (!Validator.isEmptyString(trimmedValue) && trimmedValue.length > 1) {
        //     this.value = trimmedValue;
        //     this.errorController.hide();
        //     this.valid = true;
        //     this.notifyForChanges();
        //     return;
        // }
        // this.valid = false;
        this.errorController.show("malahya");
        // this.notifyForChanges();
    }



    clear() {
        this.value = TYPOGRAPHY.emptyString;
        this.inputField.then(inputField => inputField.value = this.value);
        this.valid = false;
        this.errorController.hide();
    }

}
