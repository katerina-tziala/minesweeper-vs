"use strict";

import "../../../styles/pages/_home.scss";

import { TYPOGRAPHY } from "../../utils/constants/typography.constants";
import { ElementGenerator } from "../../utils/element-generator";
import { ElementHandler } from "../../utils/element-handler";
import { LocalStorageHelper } from "../../utils/local-storage-helper";

import { Page } from "../page";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./home.constants";

import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";

export class Home extends Page {
    constructor() {
        super();
        this.init();
    }



    init() {
        this.displayLoader();
        this.getClearedMainContainer()
            .then(mainContainer => {

                console.log(mainContainer);
                console.log("welcome home");
                // console.log(self.user);
                // console.log(self.settingsController.settings);
                // console.log(self.peers);
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
