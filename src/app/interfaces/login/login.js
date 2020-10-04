'use strict';

import './login.scss';

import { DOM_ELEMENT_CLASS, FORM_PARAMS} from './login.constants';

import { Interface } from '../interface';
import { ElementGenerator } from '../../utilities/element-generator';
// // import { ElementHandler } from '../../utilities/element-handler';

import { FormUsername } from '../../components/form/form-username/form-username';



export class Login extends Interface {

    constructor() {
        super();
        this.loginForm = new FormUsername(this.getFormValues.bind(this));
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
        container.append(this.loginForm.renderForm(FORM_PARAMS));
        return container;
    }

    getFormValues(formValues) {
        console.log(formValues);
        // this.interfaceActionHandler(user);
    }

}
