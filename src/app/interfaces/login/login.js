'use strict';
import { Interface } from '../interface';
import { Form } from '../../components/form/form';

import { LoginConstants } from './login.constants';
import { ElementHandler } from '../../ui-utils/element-handler';
export class Login extends Interface {

    constructor() {
        super();
        // this.loginForm = new LoginForm(this.getNewUser.bind(this));

        this.loginForm = new Form();

        this.init();
    }

    init() {
        this.displayLoader();
        this.getClearedMainContainer().then(mainContainer => {
            console.log(mainContainer);
            //mainContainer.append(this.renderLoginForm());
            this.hideLoader();
        });
    }

    // renderLoginForm() {
    //     const container = document.createElement('div');
    //     ElementHandler.addElementStyleClass(container, LoginConstants.styleClassList.loginContainer);
    //     container.append(this.loginForm.renderForm(LoginConstants.formParams));
    //     return container;
    // }


    // getNewUser(user) {
    //     console.log(user);
    //     // this.interfaceActionHandler(user);
    // }

}
