'use strict';

import './form.scss';

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CLEAR_BTN } from './form.constants';

import { ElementGenerator } from '../../utilities/element-generator';
import { ElementHandler } from '../../utilities/element-handler';
import { AppHelper } from '../../utilities/app-helper';

export class Form {
    #inputControllers;
    #submitAction;

    constructor(submitAction) {
        this.#submitAction = submitAction;
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

    getInputController(key) {
        return this.#inputControllers[key];
    }

    renderFormTitle(title) {
        return `<h2 class='${DOM_ELEMENT_CLASS.formTitle}'>${title}</h2>`;
    }

    renderFormSection() {
        return ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.formSection);
    }

    renderForm(params) {
        const form = document.createElement('form');
        this.setFormmActionOnEnter(form);
        ElementHandler.addStyleClass(form, DOM_ELEMENT_CLASS.form);
        ElementHandler.setID(form, params.id);
        if (params.title) {
            form.innerHTML = this.renderFormTitle(params.title);
        }
        this.renderFormFields(form);
        this.renderFormActions(form, params.submitBtn);
        return form;
    }

    setFormmActionOnEnter(form) {
        form.onkeypress = (event) => {
            const key = event.keyIdentifier || event.keyCode || 0;
            if (key === 13) {
                AppHelper.preventInteraction(event);
              
                console.log('on enter');
            }
        }
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


    submitForm() {
        console.log('submitForm');

    }



    clearForm() {
        this.inputControllers.forEach(inputController => inputController.clear());
        this.toggleSubmission();
    }

    toggleSubmission() {
        this.submitBtn.then(button => ElementHandler.setDisabled(button, !this.isValid));
    }

    /* ~~~~~~~~~~~~~~~~~~~~ ABSTRACT FUNCTIONS ~~~~~~~~~~~~~~~~~~~~ */
    renderFormFields(form) { }













}
