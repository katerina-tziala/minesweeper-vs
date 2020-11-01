"use strict";
import { OnlineConnection } from "./online-connection/online-connection";

import { Login } from "./pages/login/login";


import { NOTIFICATION_MESSAGE } from "./components/toast-notification/toast-notification.constants";

import { AppSettingsModel } from "./utilities/models/app-settings";

import { SettingsController } from "./components/settings-controller/settings-controller";
import { LocalStorageHelper } from "./utilities/local-storage-helper";




export class App {

	constructor() {
		this.user = undefined;
		this.interfaceController = undefined;
		this.conn = undefined;
		this.peers = [];
		this.initSettings();
		this.init();
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
		if (this.user) {
			console.log(this.user);


		} else {
			this.interfaceController = new Login(this.login.bind(this));
		}


	}

	login(formValues) {
		self.appLoader.display();
		console.log("login");
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
			console.log("onConnectionError");
			console.log(event);

		} else {// login error
			console.log("login error");
			this.conn = undefined;
			self.toastNotifications.show(NOTIFICATION_MESSAGE.connectionError);
			self.appLoader.hide();
		}
	}


	onConnectionClose(event) {

		console.log("onConnectionClose");
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
				console.log("onConnectionMessage");
				console.log(message);
				break;
		}
	}





















}