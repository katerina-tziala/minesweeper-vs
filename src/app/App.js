'use strict';

import { Login } from './interfaces/Login';

export class App {

    constructor() {
        this.user = undefined;
        this.interfaceController = undefined;
        this.conn = undefined;
        this.init();
    }


    init() {
        if (this.user) {

        } else {
            console.log('login');
            this.interfaceController = new Login(this.loginUser.bind(this));
            // .then((user) => {
            //     console.log(user);
            //     // this.user.setUsername(username);
            //     // LocalStorageHelper.setUser(this.user);
            //     // if (this.conn) {
            //     //     this.handleConnectionOnLogin();
            //     // } else {
            //     //     console.log('login without connection');
            //     //     this.initInterface();
            //     // }
            // });
        }
    }

    loginUser() {
        console.log("loginUser");
    }




}