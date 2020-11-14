"use strict";

import "../../../styles/pages/_game.scss";

import { TYPOGRAPHY } from "../../_utils/constants/typography.constants";
import { ElementGenerator } from "../../_utils/element-generator";
import { ElementHandler } from "../../_utils/element-handler";
import { LocalStorageHelper } from "../../_utils/local-storage-helper";

import { Page } from "../page";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, FORM_PARAMS } from "./game-page.constants";

import { FormUsername } from "../../components/form/form-username/form-username";
import { StateLoader } from "../../components/loaders/state-loader/state-loader";

import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";


import { GameWizard } from "../../components/game-wizard/game-wizard";



export class GamePage extends Page {
    #gameType;

    constructor(gameType) {
        super();
        this.gameType = gameType;
        self.settingsController.gameSettingsHidden = false;
        this.init();

        this.gameWizard = new GameWizard();
    }

    set gameType(type) {
        this.#gameType = type;
    }

    get gameType() {
        return this.#gameType;
    }

    init() {
        this.displayLoader();
        this.getClearedMainContainer()
            .then(mainContainer => {

                mainContainer.append(this.gameWizard.generateWizard());
                console.log("game page");
                console.log(this.gameType);

                this.hideLoader();
            });
    }



    // Overridden functions
    onConnectionError(errorMessage) {
        //super.onConnectionError(errorMessage);

    }

}
