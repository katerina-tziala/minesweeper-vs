'use strict';

import { Login } from './interfaces/login/login';

export class App {

    constructor() {
        this.user = undefined;
        this.interfaceController = undefined;
        this.conn = undefined;
        this.init();
    }


    init() {
        if (this.user) {
            console.log(this.user);


        } else {
            this.interfaceController = new Login(this.loginUser.bind(this));
        }
    }

    loginUser(formValues) {

        console.log('loginUser');
        console.log(formValues);


    }




}