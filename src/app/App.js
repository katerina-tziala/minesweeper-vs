'use strict';
import { OnlineConnection } from './online-connection/online-connection';

import { Login } from './interfaces/login/login';


import { NOTIFICATION_MESSAGE } from './skeleton/toast-notification/toast-notification.constants';




export class App {

    constructor() {
        this.user = undefined;
        this.interfaceController = undefined;
        this.conn = undefined;
        this.peers = [];
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
            this.conn.loginToWebsocket(userParams);
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
        }
    }


    onConnectionClose(event) {

        console.log('onConnectionClose');
        console.log(event);

    }

    onConnectionMessage(message) {
        switch (message.type) {
            case "username-in-use":
                self.toastNotifications.show(NOTIFICATION_MESSAGE.usernameInUse);
                break;
            case "broadcast":
                console.log("--- broadcast -----");
                console.log(message.data);
                break;
            default:
                console.log('onConnectionMessage');
                console.log(message);
                break;
        }
    }





















}