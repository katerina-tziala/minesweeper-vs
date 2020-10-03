'use strict';

import './login.scss';

import { DOM_ELEMENT_CLASS } from './login.constants';

import { Interface } from '../interface';
import { ElementGenerator } from '../../utilities/element-generator';
// import { ElementHandler } from '../../utilities/element-handler';
import { Form } from '../../components/form/form';



export class Login extends Interface {

    constructor() {
        super();
        // this.loginForm = new LoginForm(this.getNewUser.bind(this));

        this.loginForm = new Form();

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
   
        
        // container.append(this.loginForm.renderForm(LoginConstants.formParams));
        return container;
    }


    // getNewUser(user) {
    //     console.log(user);
    //     // this.interfaceActionHandler(user);
    // }

}
