"use strict";

import "../../../styles/pages/_login.scss";

import { TYPOGRAPHY } from "../../utils/constants/typography.constants";
import { ElementGenerator } from "../../utils/element-generator";
import { ElementHandler } from "../../utils/element-handler";
import { LocalStorageHelper } from "../../utils/local-storage-helper";

import { Page } from "../page";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, FORM_PARAMS } from "./home.constants";

import { FormUsername } from "../../components/form/form-username/form-username";
import { StateLoader } from "../../components/loaders/state-loader/state-loader";

import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";

export class Home extends Page {
    #loginForm;

    constructor() {
        super();
        this.init();
    }

    get loginContainer() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.loginContainer);
    }

    init() {
        this.displayLoader();
        this.getClearedMainContainer()
            .then(mainContainer => {
                console.log(mainContainer);
                console.log("welcome home");
                console.log(self.user);
                console.log(self.settingsController.settings);
                console.log(self.peers);
                this.hideLoader();
            });
    }


    // Overridden functions
    onConnectionError(errorMessage) {
        console.log(errorMessage);
        // super.onConnectionError(errorMessage);
        // this.loginContainer.then(container => StateLoader.hide(container));
    }
}
