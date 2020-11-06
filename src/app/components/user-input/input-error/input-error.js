"use strict";

import { TYPOGRAPHY } from "../../../utils/constants/typography.constants";
import { ElementGenerator } from "../../../utils/element-generator";
import { ElementHandler } from "../../../utils/element-handler";
import { AriaHandler } from "../../../utils/aria-handler";

import {
	DOM_ELEMENT_ID,
	DOM_ELEMENT_CLASS,
	TOGGLE_BTN,
	TOGGLE_BTN_ARIA
} from "./input-error.constants";

export class InputError {
	#messageDisplayed;
	#name;

	constructor(name) {
		this.name = name;
		this.messageDisplayed = false;
	}

	set name(value) {
		this.#name = value;
	}

	get name() {
		return this.#name;
	}

	set messageDisplayed(status) {
		this.#messageDisplayed = status;
	}

	get messageDisplayed() {
		return this.#messageDisplayed;
	}

	get toggleBtnID() {
		return DOM_ELEMENT_ID.error + this.name;
	}

	get messageID() {
		return DOM_ELEMENT_ID.errorMessage + this.name;
	}

	get toggleBtn() {
		return ElementHandler.getByID(this.toggleBtnID);
	}

	get messageContainer() {
		return ElementHandler.getByID(this.messageID);
	}

	get inputField() {
		return ElementHandler.getByID(this.name);
	}

	generateInputError() {
		const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.errorContainer]);
		container.append(this.generateErrorToggle(), this.generateErrorMessage());
		return container;
	}

	generateErrorToggle() {
		const button = ElementGenerator.generateButton(TOGGLE_BTN, this.toggleErrorMessage.bind(this));
		ElementHandler.hide(button);
		ElementHandler.setID(button, this.toggleBtnID);
		return button;
	}

	generateErrorMessage() {
		const errorMessage = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.errorMessage], this.messageID);
		ElementHandler.hide(errorMessage);
		return errorMessage;
	}

	toggleErrorMessage() {
		this.messageDisplayed ? this.hideErrorMessage() : this.displayErrorMessage();
	}

	hideErrorMessage() {
		this.messageContainer.then(messageContainer => ElementHandler.hide(messageContainer));
		this.messageDisplayed = false;
		this.updateToggleBtnAria();
	}

	displayErrorMessage() {
		this.messageContainer.then(messageContainer => ElementHandler.display(messageContainer));
		this.messageDisplayed = true;
		this.updateToggleBtnAria();
	}

	updateToggleBtnAria() {
		this.toggleBtn.then(button => AriaHandler.setAriaLabel(button, TOGGLE_BTN_ARIA[JSON.stringify(this.messageDisplayed)]));
	}

	show(message) {
		this.toggleBtn.then(button => {
			this.hideErrorMessage();
			ElementHandler.display(button);
			AriaHandler.setAlertRole(button);
			AriaHandler.setAriaAssertive(button);
			this.setErrorMessage(message);
			this.inputField.then(inputField => ElementHandler.addStyleClass(inputField, DOM_ELEMENT_CLASS.errorInput));
		});
	}

	hide() {
		this.toggleBtn.then(button => {
			this.hideErrorMessage();
			ElementHandler.hide(button);
			AriaHandler.removeRole(button);
			AriaHandler.removeAriaLive(button);
			this.setErrorMessage(TYPOGRAPHY.emptyString);
			this.inputField.then(inputField => ElementHandler.removeStyleClass(inputField, DOM_ELEMENT_CLASS.errorInput));
		});
	}

	setErrorMessage(message) {
		this.messageContainer.then(messageContainer => ElementHandler.setContent(messageContainer, message));
	}

}
