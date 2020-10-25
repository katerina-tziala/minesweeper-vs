"use strict";

import { CLEAR_BTN } from "../../utilities/constants/btn-text.constants";

import { ElementGenerator } from "../../utilities/element-generator";
import { ElementHandler } from "../../utilities/element-handler";
import { preventInteraction } from "../../utilities/utils";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./form.constants";

import "./form.scss";

export class Form {
	#inputControllers;
	#onFormSubmission;

	constructor(formSubmission) {
		this.#onFormSubmission = formSubmission;
		this.#inputControllers = {};
	}

	set inputControllers(controller) {
		delete this.#inputControllers[controller.name];
		this.#inputControllers[controller.name] = controller;
	}

	get inputControllers() {
		return Object.values(this.#inputControllers);
	}

	get submissionBtnId() {
		return DOM_ELEMENT_ID.submitBtn;
	}

	get submitBtn() {
		return ElementHandler.getByID(this.submissionBtnId);
	}

	get isValid() {
		return this.inputControllers.every(inputController => inputController.valid);
	}

	get formValues() {
		const formValues = {};
		this.inputControllers.forEach(input => formValues[input.name] = input.value);
		return formValues;
	}

	getInputController(key) {
		return this.#inputControllers[key];
	}

	renderFormTitle(title) {
		return `<h2 class="${DOM_ELEMENT_CLASS.formTitle}">${title}</h2>`;
	}

	renderFormSection() {
		return ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.formSection);
	}

	renderForm(params) {
		const form = document.createElement("form");
		this.setFormActionOnEnter(form);
		ElementHandler.addStyleClass(form, DOM_ELEMENT_CLASS.form);
		ElementHandler.setID(form, params.id);
		if (params.title) {
			form.innerHTML = this.renderFormTitle(params.title);
		}
		this.renderFormFields(form);
		this.renderFormActions(form, params.submitBtn);
		return form;
	}

	setFormActionOnEnter(form) {
		form.onkeypress = (event) => {
			const key = event.keyIdentifier || event.keyCode || 0;
			if (key === 13) {
				preventInteraction(event);
				this.submitForm();
			}
		};
	}

	renderFormActions(form, submitBtnParams) {
		const actionsContainer = ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.formActions);
		const clearBtn = ElementGenerator.generateButton(CLEAR_BTN, this.clearForm.bind(this));
		const submitBtn = ElementGenerator.generateButton(submitBtnParams, this.submitForm.bind(this));
		ElementHandler.setDisabled(submitBtn, !this.isValid);
		ElementHandler.setID(submitBtn, this.submissionBtnId);
		actionsContainer.append(clearBtn, submitBtn);
		form.append(actionsContainer);
	}

	clearForm(event) {
		event.target.blur();
		this.inputControllers.forEach(inputController => inputController.clear());
		this.toggleSubmission();
	}

	toggleSubmission() {
		this.submitBtn.then(button => ElementHandler.setDisabled(button, !this.isValid));
	}

	submitForm() {
		if (this.isValid && this.#onFormSubmission) {
			this.#onFormSubmission(this.formValues);
		}
	}

	renderFormFields(form) {
		const section = this.renderFormSection();
		this.inputControllers.forEach(inputControler => section.append(inputControler.generateInput()));
		form.append(section);
	}
}
