import './username-form.scss';
import { ElementHandler } from '../../element-handler';
import { DOM_ELEMENT_CLASS, ATTRIBUTES, ERROR_MESSAGE } from './username-form.constants';
import { UsernameFormTemplateHelper as TemplateHelper } from './UsernameFormTemplateHelper';
import UsernameValidation from './username-validation';

export default class UsernameForm extends HTMLElement {
  #eventsIndex;

  constructor() {
    super();
    this.#eventsIndex = new Map();
  }

  get #type() {
    return this.getAttribute(ATTRIBUTES.type);
  }

  get #input() {
    return this.querySelector(`.${DOM_ELEMENT_CLASS.input}`);
  }

  get #clearButton() {
    return this.querySelector(`.${DOM_ELEMENT_CLASS.clearButton}`);
  }

  get #submitButton() {
    return this.querySelector(`.${DOM_ELEMENT_CLASS.submitButton}`);
  }

  get #username() {
    const input = this.#input;
    if (input) {
      return input.value;
    }
    return;
  }

  get #errorDisplayed() {
    const input = this.#input;
    if (input) {
      return input.hasError;
    }
    return false;
  }

  get #validationError() {
    return UsernameValidation.validationError(this.#username);
  }

  connectedCallback() {
    this.innerHTML = TemplateHelper.generateTemplate(this.#type);
    this.#setFormListener();
    this.#setInputListener();
    this.#setButtonListener(DOM_ELEMENT_CLASS.clearButton, this.#onClearForm.bind(this));
    this.#setButtonListener(DOM_ELEMENT_CLASS.submitButton, this.#onSubmitForm.bind(this));
  }

  init(username) {
    if (UsernameValidation.valid(username)) {
      TemplateHelper.setInputValue(this.#input, username);
      this.#validateForm();
    }
    this.#checkFormActions();
  }

  disconnectedCallback() {
    for (const [key, eventParams] of this.#eventsIndex) {
      const element = this.querySelector(`.${key}`);
      const { actionType, action } = eventParams;
      if (element) {
        element.removeEventListener(actionType, action);
        this.#eventsIndex.delete(actionType);
      }
    }
    this.#eventsIndex = undefined;
  }

  #checkEventListener(elementClass, callBack) {
    const element = this.querySelector(`.${elementClass}`);
    if (element && !this.#eventsIndex.has(elementClass)) {
      callBack(element);
    }
  }

  #setFormListener() {
    const elementClass = DOM_ELEMENT_CLASS.form;
    this.#checkEventListener(elementClass, (element) => {
      const action = this.#onFormKeyDown.bind(this);
      const actionType = 'keydown';
      element.addEventListener(actionType, action);
      this.#eventsIndex.set(elementClass, { actionType, action });
    });
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

  #setInputListener() {
    const elementClass = DOM_ELEMENT_CLASS.input;
    this.#checkEventListener(elementClass, (element) => {
      const action = this.#onUsernameChange.bind(this);
      const actionType = 'onValueChange';
      element.addEventListener(actionType, action);
      this.#eventsIndex.set(elementClass, { actionType, action });
    });
  }

  #onUsernameChange() {
    const errorDisplayed = this.#errorDisplayed;
    if (errorDisplayed) {
      this.#validateForm();
    } else {
      this.#checkFormActions();
    }
  }

  #validateForm() {
    const validationError = this.#validationError;
    if (validationError) {
      this.setFormError(ERROR_MESSAGE[validationError]);
    } else {
      TemplateHelper.setInputError(this.#input);
      ElementHandler.setDisabled(this.#submitButton, false);
      this.#checkClear();
    }
  }

  #setButtonListener(elementClass, action) {
    this.#checkEventListener(elementClass, (element) => {
      const actionType = 'click';
      element.addEventListener(actionType, action);
      this.#eventsIndex.set(elementClass, { actionType, action });
    });
  }

  #onClearForm(event) {
    event.preventDefault();
    event.stopPropagation();
    TemplateHelper.setInputValue(this.#input);
    TemplateHelper.setInputError(this.#input);
    this.#checkFormActions();
  }

  #onSubmitForm(event) {
    event.preventDefault();
    event.stopPropagation();
    const validationError = this.#validationError;
    if (validationError) {
      TemplateHelper.setInputError(this.#input, ERROR_MESSAGE[validationError]);
    } else {
      this.#submitUsername();
    }
  }

  #checkFormActions() {
    this.#checkSubmission();
    this.#checkClear();
  }

  #checkSubmission() {
    const submissionAllowed = UsernameValidation.validMinLength(this.#username);
    ElementHandler.setDisabled(this.#submitButton, !submissionAllowed);
  }

  #checkClear() {
    const clearAllowed = (this.#username && this.#username.length) ? true : false || this.#errorDisplayed;
    ElementHandler.setDisabled(this.#clearButton, !clearAllowed);
  }

  #submitUsername() {
    const username = this.#username;
    const event = new CustomEvent('onSubmit', { detail: { username } });
    this.dispatchEvent(event);
  }

  disableFormButtons() {
    ElementHandler.setDisabled(this.#submitButton);
    ElementHandler.setDisabled(this.#clearButton);
  }

  enableFormButtons() {
    ElementHandler.setDisabled(this.#submitButton, false);
    ElementHandler.setDisabled(this.#clearButton, false);
  }

  setFormError(error) {
    TemplateHelper.setInputError(this.#input, error);
    ElementHandler.setDisabled(this.#submitButton);
    this.#checkClear();
  }
}

customElements.define('app-username-form', UsernameForm);