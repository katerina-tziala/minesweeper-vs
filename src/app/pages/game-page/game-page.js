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


import { GameWizardOriginal } from "~/game/game-wizard/game-wizard-original/game-wizard-original";
import { GameWizardVS } from "~/game/game-wizard/game-wizard-vs/game-wizard-vs";
import { GameWizardBot } from "~/game/game-wizard/game-wizard-vs/game-wizard-bot";







import { GameType } from "Game";


export class GamePage extends Page {
    #gameType;

    constructor(gameType, navigateToHome) {
        super();
        this.gameType = gameType;
        self.settingsController.gameSettingsHidden = false;
        this.init();
        this.navigateToHome = navigateToHome;

        this.game = undefined;
        switch (gameType) {
            case GameType.Original:
                this.gameWizard = new GameWizardOriginal(this.navigateToHome, this.onPlayGame.bind(this));
                break;
            case GameType.Bot:
                this.gameWizard = new GameWizardBot(this.navigateToHome, this.onPlayGame.bind(this));
                break;
                case GameType.Friend:
                    this.gameWizard = new GameWizardVS(this.navigateToHome, this.onPlayGame.bind(this));
                    break;
            default:
                console.log(gameType);
                break;
        }




    }

    set gameType(type) {
        this.#gameType = type;
    }

    get gameType() {
        return this.#gameType;
    }

    renderPage(mainContainer) {
        mainContainer.append(this.gameWizard.generateWizard());
    }

    onPlayGame(game) {
        //super.onConnectionError(errorMessage);
        console.log(game);
        this.displayLoader();
        this.getClearedMainContainer().then(mainContainer => {
            console.log(mainContainer);
            console.log("game ooon");
            this.hideLoader();
        });
    }

    // Overridden functions
    onConnectionError(errorMessage) {
        //super.onConnectionError(errorMessage);

    }





}
