"use strict";

import { ElementGenerator } from "HTML_DOM_Manager";

import { Form } from "../form";
import { TextInput } from "UserInputs";

import { DOM_ELEMENT_CLASS, FIELD } from "./form-username.constants";

export class FormUsername extends Form {

	constructor(submitAction, username) {
		super(submitAction);
		this.inputControllers = new TextInput(FIELD, username, this.toggleSubmission.bind(this));
	}

	renderFormFields(form) {
		const section = this.renderFormSection();
		section.append(ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.usernameIcon]));
		this.inputControllers.forEach(inputControler => section.append(inputControler.generateInputField()));
		form.append(section);
	}

}
