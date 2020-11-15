"use strict";

import { SWITCH_BNT } from "./switcher.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { clone } from "~/_utils/utils";

import { UserInput } from "../user-input";

export class Switcher extends UserInput {
    #ariaLabel;

    constructor(params, onValueChange) {
        super(params.name, params.value, onValueChange);
        this.valid = true;
        this.ariaLabel = params.ariaLabel;
    }

    set ariaLabel(ariaLabel) {
        this.#ariaLabel = ariaLabel;
    }

    get ariaLabel() {
        return this.#ariaLabel;
    }

    get inputParams() {
        const params = clone(SWITCH_BNT);
        const attributes = {
            "id": this.name,
            "aria-label": this.ariaLabel
        };
        params.attributes = Object.assign(params.attributes, attributes);
        return params;
    }

    generateInputField() {
        const switcher = ElementGenerator.generateButton(this.inputParams, this.onSwitchChange.bind(this));
        this.setSwitcherState(switcher);
        ElementHandler.setDisabled(switcher, this.disabled)
        return switcher;
    }

    onSwitchChange(event) {
        this.value = !AriaHandler.getAriaChecked(event.target);
        this.updateSwitcherDisplay();
        this.notifyForChanges();
    }

    setSwitcherState(switcher) {
        AriaHandler.setAriaChecked(switcher, this.value);
    }

    updateSwitcherDisplay() {
        this.inputField.then(switcher => this.setSwitcherState(switcher));
    }

    disable() {
        this.disabled = true;
        this.toggleSwitcherDisabled();
    }

    enable() {
        this.disabled = false;
        this.toggleSwitcherDisabled();
    }

    toggleSwitcherDisabled() {
        this.inputField.then(switcher => ElementHandler.setDisabled(switcher, this.disabled));
    }

}
