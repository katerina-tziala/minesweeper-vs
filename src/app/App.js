"use strict";
import { OnlineConnection } from "./online-connection/online-connection";

import { Login } from "./pages/login/login";


import { NOTIFICATION_MESSAGE } from "./components/toast-notification/toast-notification.constants";

import { AppSettingsModel } from "./utilities/models/app-settings";

import { SettingsController } from "./components/settings-controller/settings-controller";
import { LocalStorageHelper } from "./utilities/local-storage-helper";

import { User } from "./utilities/models/user";



export class App {

    constructor() {
        this.user = undefined;
        this.interfaceController = undefined;

        self.onlineConnection = new OnlineConnection({
            onError: this.onConnectionError.bind(this),
            onClose: this.onConnectionClose.bind(this),
            onMessage: this.onConnectionMessage.bind(this),
        });


        this.initSettings();

        this.init();

        self.user = undefined;
        this.peers = [];

        // self.user = new User("kateID", "kate", null);
        // this.setInterface("home");
    }

    initSettings() {
        this.settings = new AppSettingsModel();
        const savedSettings = LocalStorageHelper.retrieve("settings");
        if (savedSettings) {
            this.settings.update(savedSettings);
        }
        this.settingsController = new SettingsController(this.settings, false);
    }




    init() {

        this.interfaceController = new Login();

    }








    onConnectionError(event) {
        console.log("onConnectionError from app");
        console.log(event);

        this.interfaceController.onConnectionError(NOTIFICATION_MESSAGE.connectionError);
        // if (this.user) {
        // 	console.log("onConnectionError");
        // } else {// login error
        // 	console.log("login error");
        // 	self.toastNotifications.show(NOTIFICATION_MESSAGE.connectionError);
        // 	self.appLoader.hide();
        // }
    }


    onConnectionClose(event) {

        console.log("onConnectionClose from app");
        console.log(event);

    }

    onConnectionMessage(message) {
        console.log("onConnectionMessage from app");
        switch (message.type) {
            case "username-in-use":
                this.interfaceController.onConnectionError(NOTIFICATION_MESSAGE.usernameInUse);
                break;
            case "broadcast":
                this.handleConnectionBroadcast(message.data);
                break;
            default:
                console.log("onConnectionMessage");
                console.log(message);
                break;
        }
    }

    handleConnectionBroadcast(data) {
        if (self.user) {
            console.log("user is here");
            console.log("--- broadcast -----");
            console.log(data);
        } else { // user just joined
            self.user = this.generateUser(data.user);
            this.setPeers(data.peers);
            LocalStorageHelper.save("username", self.user.username);
            this.setInterface("home");
        }
    }

    setPeers(peers) {
        this.peers = peers.map(peerData => this.generateUser(peerData));
    }


    generateUser(userData) {
        return new User(userData.id, userData.username, userData.gameRoomId);
    }

    setInterface(interfaceName) {
        switch (interfaceName) {
            case "home":
                console.log("land on home");
                break;

            // default:

            //     break;
        }


    }












}