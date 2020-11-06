"use strict";

import { SWITCH_BNT } from "./switcher.constants";

import { ElementGenerator } from "../../../utils/element-generator";
import { ElementHandler } from "../../../utils/element-handler";
import { clone } from "../../../utils/utils";
import { AriaHandler } from "../../../utils/aria-handler";

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
        this.inputField.then(switcher => ElementHandler.setDisabled(switcher, true));
    }

    enable() {
        this.inputField.then(switcher => ElementHandler.setDisabled(switcher, false));
    }

}
