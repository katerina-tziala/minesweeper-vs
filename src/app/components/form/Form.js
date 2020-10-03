'use strict';
// import { ElementHandler } from '../../ui-utils/element-handler';
// import { FormConstants } from './form.constants';
// import { AppHelper } from '../../shared/AppHelper';
import './form.scss';

export class Form {
    #inputControllers;
    // #submissionBtnId;

    constructor() {
        console.log('form');
        // this.submissionBtnId = submissionBtnId;
        // this.#inputControllers = {};
    }

    set inputControllers(controller) {
        delete this.#inputControllers[controller.name];
        this.#inputControllers[controller.name] = controller;
    }

    get inputControllers() {
        return Object.values(this.#inputControllers);
    }

    getInputController(key) {
        return this.#inputControllers[key];
    }

    // set submissionBtnId(submissionBtnId) {
    //     this.#submissionBtnId = submissionBtnId;
    // }

    // get submissionBtnId() {
    //     return this.#submissionBtnId;
    // }

    // get inputControllers() {
    //     return Object.values(this.#inputControllers);
    // }

    // get submissionButton() {
    //     return ElementHandler.getElementByID(this.submissionBtnId);
    // }


    // renderForm(params) {
    //     console.log(params);
    //     const form = document.createElement('form');
    //     ElementHandler.addElementStyleClass(form, FormConstants.styleClassList.form);
    //     // ElementHandler.setElementId(form, formParams.id);
    //     // if (formParams.title) {
    //     //     form.innerHTML = this.generateFormTitle(formParams.title);
    //     // }
    //     return form;
    // }

    // generateFormTitle(title) {
    //     return `<p class='${FormConstants.styleClassList.formTitle}'>${title}</p>`;
    // }

    // setFormmActionOnEnter(form, action) {
    //     form.onkeypress = (event) => {
    //         const key = event.keyIdentifier || event.keyCode || 0;
    //         if (key === 13) {
    //             AppHelper.preventInteraction(event);
    //             if (action) {
    //                 action();
    //             }
    //         }
    //     }
    // }

    // generateFormSection() {
    //     const formSection = document.createElement('div');
    //     ElementHandler.addElementStyleClass(formSection, FormConstants.styleClassList.formSection);
    //     return formSection;
    // }

    // generateFormButtonsContainer() {
    //     const formSection = this.generateFormSection();
    //     ElementHandler.addElementStyleClass(formSection, FormConstants.styleClassList.formActions);
    //     return formSection;
    // }

    // generateFormActionButtons() {
    //     const formSection = this.generateFormButtonsContainer();
    //     const clearBtn = ElementGenerator.generateTextButton(TextButtons.clear, this.clearForm.bind(this));
    //     formSection.append(clearBtn);
    //     return formSection;
    // }

    // clearForm() {
    //     this.inputControllers.forEach(inputController => inputController.clearField());
    //     this.toggleSubmission();
    // }

    // toggleSubmission() {
    //     const validForm = this.inputControllers.every(inputController => inputController.valid);
    //     this.submissionButton.then(button => ElementHandler.setDisabled(button, !validForm));
    // }
}
