"use strict";

import { SWITCH_BNT } from "./switcher.constants";

import { ElementGenerator } from "../../../utilities/element-generator";
import { ElementHandler } from "../../../utilities/element-handler";
import { preventInteraction, clone } from "../../../utilities/utils";

import { UserInput } from "../user-input";
import { AriaHandler } from "../../../utilities/aria-handler";

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
		preventInteraction(event);
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
