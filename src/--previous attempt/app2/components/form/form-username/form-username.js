"use strict";

import { ElementGenerator } from "HTML_DOM_Manager";

import { Form } from "../form";
import { TextInput } from "UserInputs";

import { DOM_ELEMENT_CLASS, FIELD, USERNAME_LENGTH } from "./form-username.constants";

export class FormUsername extends Form {
  constructor(submitAction, username) {
    super(submitAction);
    
    const usernameInput = new TextInput(
      FIELD,
      username,
      this.toggleSubmission.bind(this),
    );
    usernameInput.setLengthBoundaries(USERNAME_LENGTH.min, USERNAME_LENGTH.max);
    this.inputsGroup.controllers = usernameInput;
  }

  renderFormFields(form) {
    const section = this.renderFormSection();
    section.append(
      ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.usernameIcon]),
    );
    this.inputsGroup.controllers.forEach((inputControler) =>
      section.append(inputControler.generateInputField()),
    );
    form.append(section);
  }
}
