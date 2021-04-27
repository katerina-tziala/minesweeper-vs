'use strict';
import './add-username.scss';
import { ElementGenerator, ButtonGenerator } from 'UI_ELEMENTS';
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

    #initForm() {
        this.#form = new UsernameForm(this.#onFormSubmit.bind(this));
        this.#form.init(this.#submitText);
    }

    render() {
        this.#initForm();
        return this.#generate();
    }

    #generate() {
        const card = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.component]);
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
}
