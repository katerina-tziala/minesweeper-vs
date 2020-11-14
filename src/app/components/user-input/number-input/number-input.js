"use strict";

import { TYPOGRAPHY } from "../../../utils/constants/typography.constants";
import { ElementGenerator } from "../../../utils/element-generator";
import { Validator } from "../../../utils/validator";
import { clone, replaceStringParameter } from "../../../utils/utils";

import { DOM_ELEMENT_CLASS, FIELD_PARAMS, FIELD_ERROR, CONTROLL_BUTTONS } from "./number-input.constants";

import { TextInput } from "../text-input/text-input";
import { InputError } from "../input-error/input-error";
import { ElementHandler } from "../../../utils/element-handler";

export class NumberInput extends TextInput {
    #boundaries;

    constructor(name, value = TYPOGRAPHY.emptyString, onValueChange) {
        super(name, value, onValueChange);
        this.valid = this.numberValue !== null ? true : false;
        this.disabled = false;
    }

    set boundaries(boundaries) {
        this.#boundaries = boundaries;
    }

    get boundaries() {
        return this.#boundaries;
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
        return (this.value && this.value.trim().match(/^-?[0-9]+$/) !== null) ? parseInt(this.value, 10) : undefined;
    }

    get isUndefined() {
        return (this.valueInteger === undefined) ? true : false;
    }

    get inputError() {
        return FIELD_ERROR.invalidNumber;
    }

    get controllsID() {
        return DOM_ELEMENT_CLASS.inputControls + TYPOGRAPHY.doubleUnderscore + this.name;
    }

    generateInputField() {
        const inputContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.inputContainer]);
        const input = this.generateField(this.onKeyUp.bind(this));
        ElementHandler.setReadOnly(input, this.disabled);
        const error = this.errorController.generateInputError();
        const inputControlls = this.generateInputControlls();
        inputContainer.append(input, inputControlls, error);
        return inputContainer;
    }

    generateInputControlls() {
        const inputControlls = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.inputControls], this.controllsID);
        const upButton = ElementGenerator.generateButton(CONTROLL_BUTTONS.up, () => {
            this.updateValue(1);
        });
        ElementHandler.setDisabled(upButton, this.disabled);
        inputControlls.append(upButton);
        const downButton = ElementGenerator.generateButton(CONTROLL_BUTTONS.down, () => {
            this.updateValue(-1);
        });
        ElementHandler.setDisabled(downButton, this.disabled);
        inputControlls.append(downButton);
        return inputControlls;
    }

    onKeyUp(event) {
        const keyCode = event.keyCode || event.which;
        switch (keyCode) {
            case 38: // Up Arrow
            case 39: // Right Arrow
                this.updateValue(1);
                break;
            case 40: // Down Arrow
            case 37: // Left Arrow
                this.updateValue(-1);
                break;
            default:
                this.onValueChange(event);
                break;
        }
    }

    updateValue(step) {
        if (Validator.isEmptyString(this.value)) {
            if (this.boundaries) {
                console.log(this.valueInteger);
                console.log(this.value);
                console.log(this.boundaries);
                return;
            }
            this.value = "0";
            this.setFieldValue();
            this.validateValue();
            return;
        }


        if (!this.isUndefined) {
            this.value = (this.valueInteger + step).toString();
            this.setFieldValue();
            this.validateValue();
        }
    }




    validateInputTypeValue() {
        console.log("validateInputTypeValue");
        console.log(this.isUndefined);
        console.log(this.valueInteger);
        console.log(this.value);

        if (this.isUndefined) {
            this.valid = false;
            this.showError();
            this.notifyForChanges();
            return;
        }


        const numberValue = this.valueInteger;
        if (this.boundaries) {
            console.log(numberValue);
            console.log(this.value);
            console.log(this.boundaries);
            return;
        }
        this.valid = true;
        this.hideError();
        this.notifyForChanges();
    }

    showError(message = this.inputError) {
        super.showError(message);
        this.toggleControllButtons();
    }

    hideError() {
        super.hideError();
        this.toggleControllButtons(true);
    }


    disable() {
        this.disabled = true;
        // this.dropdownBtn.then(button => {
        // 	ElementHandler.setDisabled(button, true);
        // 	AriaHandler.setAriaExpanded(button, false);
        // });
    }

    enable() {
        this.disabled = false;
        //this.dropdownBtn.then(button => ElementHandler.setDisabled(button, false));
    }

    toggleControllButtons(show = false) {
        ElementHandler.getByID(this.controllsID).then(controllsContainer => {
            show ? ElementHandler.display(controllsContainer) : ElementHandler.hide(controllsContainer);
        });
    }

    // updateControllButtonsState(disabled) {
    //    // document.querySelectorAll(`.${DOM_ELEMENT_CLASS.inputControlBtn}`)
    //    //     .forEach(button => ElementHandler.setDisabled(button, disabled));
    // }

}
