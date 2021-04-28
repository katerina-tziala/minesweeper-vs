'use strict';
import { ElementHandler, ElementGenerator, ButtonGenerator } from 'UI_ELEMENTS';
import { DOM_ELEMENT_CLASS, ERROR_MESSAGE } from './username-form.constants';
import { UsernameValidation } from './username-validation';

export class UsernameForm {
    #usernameInput;
    #submitButton;
    #clearButton;
    #onSubmit;

    constructor(onSubmit) {
        this.#onSubmit = onSubmit;
    }

    get #username() {
        return this.#usernameInput ? this.#usernameInput.value : undefined;
    }

    get #validationError() {
        return UsernameValidation.validationError(this.#username);
    }

    init(submitText = 'join', username) {
        this.#submitButton = ButtonGenerator.generateTextButton(submitText, this.#onSubmitForm.bind(this));
        this.#clearButton = ButtonGenerator.generateTextButton('clear', this.#onClearForm.bind(this));
        this.#usernameInput = this.#generateInput(username);
        this.#initFormState(username);
    }

    #initFormState(username) {
        if (UsernameValidation.valid(username)) {
            this.#usernameInput.setAttribute('value', username);
            this.#setSubmissionDisabled(false);
            this.#setClearDisabled(false);
        } else {
            this.#setSubmissionDisabled();
            this.#setClearDisabled();
        }
    }

    generate() {
        const form = document.createElement('form');
        form.addEventListener('keydown', this.#onFormKeyDown.bind(this));
        const formActions = this.#generateFormActions();
        form.append(this.#usernameInput, formActions);
        return form;
    }

    setFormError(messageType) {
        const errorMessage = ERROR_MESSAGE[messageType] || '';
        this.#setErrorMessage(errorMessage);
        this.#setSubmissionDisabled(!!errorMessage.length);
    }

    #generateInput() {
        const input = document.createElement('app-text-input');
        input.setAttribute('name', 'username');
        input.setAttribute('leadingIcon', true);
        input.addEventListener('onValueChange', (event) => this.#onUsernameChange(event.detail));
        return input;
    }

    #generateFormActions() {
        const buttonsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.formButtons]);
        buttonsContainer.append(this.#clearButton, this.#submitButton);
        return buttonsContainer;
    }

    #onUsernameChange() {
        const errorDisplayed = JSON.parse(this.#usernameInput.getAttribute('error'));
        if (errorDisplayed) {
            this.#validateForm();
        } else {
            this.#checkFormActions();
        }
    }

    #validateForm() {
        const validationError = this.#validationError;
        if (validationError) {
            this.#setErrorMessage(ERROR_MESSAGE[validationError]);
            this.#setSubmissionDisabled();
        } else {
            this.#setErrorMessage();
            this.#setSubmissionDisabled(false);
        }
    }

    #onClearForm() {
        this.#usernameInput.setAttribute('value', '');
        this.#setErrorMessage();
        this.#checkFormActions();
    }

    #onSubmitForm() {
        const validationError = this.#validationError;
        if (validationError) {
            this.setFormError(validationError);
        } else {
            this.#submitUsername();
        }
    }

    #submitUsername() {
        const username = this.#usernameInput.value;
        if (this.#onSubmit) {
            this.#onSubmit({ username });
        }
    }

    #onFormKeyDown(event) {
        if (event.code === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.#submitOnEnter();
        }
    }

    #submitOnEnter() {
        if (UsernameValidation.valid(this.#username)) {
            this.#submitUsername();
        }
    }

    #checkSubmission() {
        const submissionAllowed = UsernameValidation.validMinLength(this.#username);
        this.#setSubmissionDisabled(!submissionAllowed);
    }

    #checkClear() {
        const clearAllowed = this.#username;
        this.#setClearDisabled(!clearAllowed);
    }

    #checkFormActions() {
        this.#checkSubmission();
        this.#checkClear();
    }

    #setErrorMessage(error = '') {
        if (this.#usernameInput) {
            this.#usernameInput.setAttribute('error-message', error);
        }
    }

    #setSubmissionDisabled(disabled = true) {
        if (this.#submitButton) {
            ElementHandler.setDisabled(this.#submitButton, disabled);
        }
    }

    #setClearDisabled(disabled = true) {
        if (this.#clearButton) {
            ElementHandler.setDisabled(this.#clearButton, disabled);
        }
    }

    disableFormButtons() {
        this.#setClearDisabled();
        this.#setSubmissionDisabled();
    }

    enableFormButtons() {
        this.#setClearDisabled(false);
        this.#setSubmissionDisabled(false);
    }
}
