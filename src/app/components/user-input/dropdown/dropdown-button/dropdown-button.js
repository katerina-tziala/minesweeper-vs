"use strict";

import "./dropdown-button.scss";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, DROPDOWN_BNT } from "./dropdown-button.constants";
import { ElementGenerator } from "../../../../utilities/element-generator";
import { ElementHandler } from "../../../../utilities/element-handler";

export class DropdownButton {
	#buttonId;
	#buttonLabelId;

	constructor(name) {
		this.buttonID = name;
		this.buttonLabelID = name;
	}

	set buttonID(name) {
		this.#buttonId = DOM_ELEMENT_ID.btn + name;
	}

	get buttonID() {
		return this.#buttonId;
	}

	set buttonLabelID(name) {
		this.#buttonLabelId = DOM_ELEMENT_ID.btnLabel + name;
	}

	get buttonLabelID() {
		return this.#buttonLabelId;
	}

	get dropdownBtn() {
		return ElementHandler.getByID(this.buttonID);
	}

	get dropdownBtn() {
		return ElementHandler.getByID(this.buttonID);
	}

	generateDropdownBtn(params, action) {
		const button = ElementGenerator.generateButton(DROPDOWN_BNT, action);
		ElementHandler.setID(button, this.buttonID);
		ElementHandler.setAriaLabel(button, params.selectText);
		button.setAttribute("aria-haspopup", "listbox");
		this.setAriaExpanded(button, params.expanded);
		ElementHandler.setDisabled(button, params.disabled);
		const buttonContent = `<div id="${this.buttonLabelID}" class="${DOM_ELEMENT_CLASS.btnLabel}">${params.displayValue}</div><div class="${DOM_ELEMENT_CLASS.btnCaret}"></div>`;
		button.innerHTML = buttonContent;
		return button;
	}

	setAriaExpanded(button, value) {
		button.setAttribute("aria-expanded", value);
	}

	updateExpandedAttribute(value) {
		this.dropdownBtn.then(btn => this.setAriaExpanded(btn, value));
	}

	disable() {
		this.dropdownBtn.then(btn => {
			ElementHandler.setDisabled(btn, true);
			ElementHandler.updateExpandedAttribute(btn, false);
		});
	}

	enable() {
		this.dropdownBtn.then(btn => ElementHandler.setDisabled(btn, false));
	}

}
