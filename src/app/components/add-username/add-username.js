'use strict';
import './add-username.scss';
import { ElementGenerator, ButtonGenerator, ElementHandler } from 'UI_ELEMENTS';
import { DOM_ELEMENT_CLASS, CONTENT } from './add-username.constants';
import { UsernameForm } from './username-form/username-form';

export class AddUsername {
    #form;
    #type;
    #onSubmit;
    #onClose;

    constructor(type = 'join', onSubmit, onClose) {
        this.#type = type;
        this.#onSubmit = onSubmit;
        this.#onClose = onClose;
    }

    get #submitText() {
        const content = CONTENT[this.#type];
        return content ? content.submitText : '';
    }

    get #titleText() {
        const content = CONTENT[this.#type];
        return content ? content.title : '';
    }

    get #card() {
        return document.getElementById(DOM_ELEMENT_CLASS.component);
    }

    get #cardLoader() {
        const card = this.#card;
        if (card) {
            const children = card.children;
            return children[children.length - 1];
        }
        return;
    }

    #initForm() {
        this.#form = new UsernameForm(this.#onFormSubmit.bind(this));
        this.#form.init(this.#submitText, 'kate');
    }

    #generate() {
        const card = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.component], DOM_ELEMENT_CLASS.component);
        if (this.#onClose) {
            const closeButton = this.#generateCloseButton();
            card.append(closeButton);
        }
        const title = ElementGenerator.generateTitleH2(this.#titleText);
        const form = this.#form.generate();
        card.append(title, form);
        return card;
    }

    #generateCloseButton() {
        return ButtonGenerator.generateIconButtonClose(this.#onClose.bind(this));
    }

    #onFormSubmit(data) {
        if (this.#onSubmit) {
            this.#onSubmit(data);
        }
    }

    setFormError(errorMessage) {
        if (this.#form) {
            this.#form.setFormError(errorMessage);
        }
    }

    #showLoader() {
        const card = this.#card;
        if (card) {
            card.append(ElementGenerator.generateLoaderIcon());
        }
    }

    #removeLoader() {
        const loader = this.#cardLoader;
        if (loader) {
            loader.remove();
        }
    }

    render() {
        this.#initForm();
        return this.#generate();
    }

    setFormSubmittionState() {
        if (this.#form) {
            this.#showLoader();
            this.#form.disableFormButtons();
        }
    }

    clearFormSubmittionState() {
        this.#removeLoader();
        if (this.#form) {
            this.#form.enableFormButtons();
        }
    }

    hide() {
        const card = this.#card;
        if (card) {
            ElementHandler.hide(card);
        }
    }

    display() {
        const card = this.#card;
        if (card) {
            ElementHandler.display(card);
        }
    }
}
