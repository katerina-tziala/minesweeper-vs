'use strict';
import { OnlineConnection } from './online-connection/online-connection';

import { Login } from './interfaces/login/login';


import { NOTIFICATION_MESSAGE } from './skeleton/toast-notification/toast-notification.constants';




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
            this.interfaceController = new Login(this.login.bind(this));
        }


    }

    login(formValues) {

        console.log('login');
        // console.log(formValues);
        this.setUpOnlineConnection(formValues);
    }


    setUpOnlineConnection(userParams) {
        if (!this.conn) {
            this.conn = new OnlineConnection(userParams, {
                onError: this.onConnectionError.bind(this),
                onClose: this.onConnectionClose.bind(this),
                onMessage: this.onConnectionMessage.bind(this),
            });
        } else {
            console.log('connection exists');
        }

    }



    onConnectionError(event) {
        if (this.user) {
            console.log('onConnectionError');
            console.log(event);

        } else {// login error
            console.log('login error');
            this.conn = undefined;
            self.toastNotifications.show(NOTIFICATION_MESSAGE.connectionError);
    
            // setTimeout(() => {
            //     self.toastNotifications.show(NOTIFICATION_MESSAGE.usernameError);
    
            // }, 5000)
        }
    }


    onConnectionClose(event) {

        console.log('onConnectionClose');
        console.log(event);

    }

    onConnectionMessage(data) {

        console.log('onConnectionMessage');
        console.log(data);

    }


}