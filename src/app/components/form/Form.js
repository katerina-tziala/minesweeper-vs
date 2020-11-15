"use strict";

import { CLEAR_BTN } from "~/_constants/btn-text.constants";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { preventInteraction } from "~/_utils/utils";

import { UserInputsGroupController } from "UserInputs";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./form.constants";

export class Form {
	#onFormSubmission;
    #inputsGroup;

	constructor(formSubmission) {
        this.#inputsGroup = new UserInputsGroupController();
		this.#onFormSubmission = formSubmission;
	}

    get inputsGroup() {
        return this.#inputsGroup;
    }

	get submissionBtnId() {
		return DOM_ELEMENT_ID.submitBtn;
	}

	get submitBtn() {
		return ElementHandler.getByID(this.submissionBtnId);
	}

	get isValid() {
		return this.inputsGroup.isValid;
	}

	get formValues() {
		return this.inputsGroup.inputData;
	}

	renderFormTitle(title) {
		return `<h2 class="${DOM_ELEMENT_CLASS.formTitle}">${title}</h2>`;
	}

	renderFormSection() {
		return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.formSection]);
	}

	renderForm(params) {
		const form = document.createElement("form");
		this.setFormActionOnEnter(form);
		ElementHandler.addStyleClass(form, DOM_ELEMENT_CLASS.form);
		if (params.title) {
			form.innerHTML = this.renderFormTitle(params.title);
		}
        this.renderFormFields(form);
        if (params.submitBtn) {
            this.renderFormActions(form, params.submitBtn);
        }
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
		const actionsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.formActions]);
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
		this.inputControllers.forEach(inputControler => section.append(inputControler.generateInputField()));
		form.append(section);
	}
}
