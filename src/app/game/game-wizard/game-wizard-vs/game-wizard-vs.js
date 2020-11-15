"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { Switcher } from "UserInputs";

import { GameType, GameVSMode, OptionsSettings, Player, GameOriginal } from "Game";

import { LevelWizard, OptionsWizard, VSTypeWizard } from "../settings-wizards/settings-wizards";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, BUTTONS, FORM_PARAMS, WIZARDS_ORDER } from "./game-wizard-vs.constants";
import { preventInteraction, clone, replaceStringParameter } from "~/_utils/utils";
import { NOTIFICATION_MESSAGE } from "~/components/toast-notification/toast-notification.constants";

import { GameWizard } from "../game-wizard";
import { FormUsername } from "~/components/form/form-username/form-username";

export class GameWizardVS extends GameWizard {
    #opponent;
    #usernameForm;

    constructor(onClose, submitGame) {

        super(onClose, submitGame);
    }

    get type() {
        return GameType.Friend;
    }

    get title() {
        return this.opponent ? this.wizardTitleWhenOpponent : CONTENT.addPlayer;
    }

    get wizardTitleWhenOpponent() {
        return replaceStringParameter(CONTENT.vs, this.opponent.name);
    }

    set opponent(opponent) {
        this.#opponent = opponent;
    }

    get opponent() {
        return this.#opponent;
    }

    set usernameForm(usernameForm) {
        this.#usernameForm = usernameForm;
    }

    get usernameForm() {
        return this.#usernameForm;
    }

    renderWizardContent(wizardContent) {
        super.renderWizardContent(wizardContent);
        if (this.opponent) {
            this.renderStepWizard(wizardContent);
        } else {
            this.renderOpponentForm(wizardContent);
        }
    }

    renderOpponentForm(wizardContainer) {
        super.renderWizardContent(wizardContainer);
        this.usernameForm = new FormUsername(this.getOpponentName.bind(this), TYPOGRAPHY.emptyString);
        wizardContainer.append(this.usernameForm.renderForm(FORM_PARAMS));
    }

    getOpponentName(params) {
        if (this.player.name === params.username) {
            self.toastNotifications.show(NOTIFICATION_MESSAGE.opponentPlayerSameName);
        } else {
            this.opponent = new Player("localOpponent", params.username, true);
            this.resetWizard();
        }
    }

    resetWizard() {
        this.wizardTitleElement.then(title => title.innerHTML = this.title);
        this.wizardContentElement.then(wizardContent => this.renderWizardContent(wizardContent));
        this.wizardActionsElement.then(wizardActions => {
            ElementHandler.clearContent(wizardActions);
            this.addActions(wizardActions);
        });
    }

    getWizardActionButtons() {
        const actionButtons = [];
        if (this.opponent) {
            console.log("now add buttons");
            actionButtons.push(this.generateResetButton());
        }
        return actionButtons;
    }

    init() {
        super.init();

        this.currentStep = 0;
        this.setVSTypeSettings();

        // console.log("rest of init");


        // console.log(WIZARDS_ORDER);
        // console.log(this.gameSettings);
        // vs-type wizard
        const vsTypeWizard = new VSTypeWizard(this.onVSTypeChange.bind(this), this.vsType);
        this.setSettingsWizards("vsTypeMode", vsTypeWizard);
    }

    setVSTypeSettings() {
        const vsTypeMode = LocalStorageHelper.retrieve("vsTypeMode");
        this.setGameSettings("vsTypeMode", vsTypeMode ? vsTypeMode : GameVSMode.Clear);
    }

    get vsType() {
        return this.getGameSettings("vsTypeMode");
    }

    onVSTypeChange(selectedVSType) {
        console.log(selectedVSType);
    }

    get currentStepWizardType() {
        return WIZARDS_ORDER[this.currentStep];
    }

    get currentStepWizard() {
        return this.getSettingsWizardByName(this.currentStepWizardType);
    }


    renderStepWizard(wizardContent) {
        ElementHandler.clearContent(wizardContent);
        // console.log("renderStepWizard re");

        // console.log(this.currentStepWizardType);

        // console.log(this.currentStepWizard);
        // // ElementHandler.clearContent(wizardContent);
        wizardContent.append(this.currentStepWizard.renderWizard());
    }

}
