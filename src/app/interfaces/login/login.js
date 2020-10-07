'use strict';

import { ElementGenerator } from '../../utilities/element-generator';

import { Interface } from '../interface';
import { FormUsername } from '../../components/form/form-username/form-username';

import { DOM_ELEMENT_CLASS, FORM_PARAMS} from './login.constants';

import './login.scss';

export class Login extends Interface {
    #loginForm;

    constructor(onFormSubmission) {
        super();
        this.#loginForm = new FormUsername(onFormSubmission);
        this.init();
    }

    init() {
        this.displayLoader();
        this.getClearedMainContainer()
            .then(mainContainer => {
                mainContainer.append(this.renderLoginForm());
                this.hideLoader();
            });
    }

    renderLoginForm() {
        const container = ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.loginContainer);
        container.append(this.#loginForm.renderForm(FORM_PARAMS));
        return container;
    }

}
