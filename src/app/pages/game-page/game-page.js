"use strict";

import "../../../styles/pages/_game.scss";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "../../_utils/local-storage-helper";

import { Page } from "../page";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, FORM_PARAMS } from "./game-page.constants";

import { FormUsername } from "../../components/form/form-username/form-username";
import { StateLoader } from "../../components/loaders/state-loader/state-loader";

import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";


import { GameWizard } from "~/game/game-wizard/game-wizard";



export class GamePage extends Page {
    #gameType;

    constructor(gameType, navigateToHome) {
        super();
        this.gameType = gameType;
        self.settingsController.gameSettingsHidden = false;
        this.init();
        this.navigateToHome = navigateToHome;
        this.gameWizard = new GameWizard(this.navigateToHome);


    }

    set gameType(type) {
        this.#gameType = type;
    }

    get gameType() {
        return this.#gameType;
    }

    renderPage(mainContainer) {
        mainContainer.append(this.gameWizard.generateWizard());
        // console.log("game page");
        console.log(this.gameType);
    }



    // Overridden functions
    onConnectionError(errorMessage) {
        //super.onConnectionError(errorMessage);

    }

}
