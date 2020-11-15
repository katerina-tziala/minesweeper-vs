"use strict";
import { OnlineConnection } from "./online-connection/online-connection";



import { NOTIFICATION_MESSAGE } from "./components/toast-notification/toast-notification.constants";


import { SettingsController } from "./components/settings-controller/settings-controller";

import { LocalStorageHelper } from "./_utils/local-storage-helper";

import { User } from "./_models/user";
import { PageType } from "./_enums/page-type.enum";
import { GameType } from "Game";


export class App {

    constructor() {


        this.interfaceController = undefined;

        self.onlineConnection = new OnlineConnection({
            onError: this.onConnectionError.bind(this),
            onClose: this.onConnectionClose.bind(this),
            onMessage: this.onConnectionMessage.bind(this),
        });


        self.settingsController = new SettingsController();



        self.user = undefined;
        self.peers = [];

        self.user = new User("kateID", "kate", null);
        // this.setInterface(PageType.Home);
        // this.setInterface();


        this.onGameNavigation("original");
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
        self.peers = peers.map(peerData => this.generateUser(peerData));
    }


    generateUser(userData) {
        return new User(userData.id, userData.username, userData.gameRoomId);
    }


    setInterface(interfaceName) {
        switch (interfaceName) {
            case PageType.Home:
                this.onHomeNavigation();
                break;
            default:
                this.loadInterfaceController(PageType.Join).then(({ JoinPage }) => {
                    this.interfaceController = new JoinPage();
                });
                break;
        }
    }

    loadInterfaceController(interfaceName) {
        return import(`./pages/${interfaceName}-page/${interfaceName}-page`);
    }

    onHomeNavigation() {
        this.loadInterfaceController(PageType.Home).then(({ HomePage }) => {
            this.interfaceController = new HomePage(this.onGameTypeSelected.bind(this));
        });
    }

    onGameNavigation(gameType) {
        this.loadInterfaceController(PageType.Game).then(({ GamePage }) => {
            this.interfaceController = new GamePage(gameType, this.onHomeNavigation.bind(this));
        });
    }



    onGameTypeSelected(gameType) {

        if (gameType === GameType.Online) {
            console.log("go to lobby");
        } else {
            this.onGameNavigation(gameType);
        }
    }








}