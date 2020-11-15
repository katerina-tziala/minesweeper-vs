"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { Switcher } from "UserInputs";

import { GameType, OptionsSettings, BotPlayer, Player, GameOriginal } from "Game";

import { LevelWizard, OptionsWizard } from "../settings-wizards/settings-wizards";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, BUTTONS } from "../game-wizard.constants";

import { GameWizardVS } from "../game-wizard-vs";

export class GameWizardBot extends GameWizardVS {
    #optionsSettings;
    #optionsWizard;

    constructor(onClose, submitGame) {
        super(onClose, submitGame)
       // this.init();
        console.log(this.botPlayer);
    }

    get type() {
        return GameType.Bot;
    }

    get botPlayer() {
        return new BotPlayer(self.settingsController.settings.opponentColorType);
    }












    set optionsSettings(optionsSettings) {
        this.#optionsSettings = optionsSettings;
    }

    get optionsSettings() {
        return this.#optionsSettings;
    }

    get optionsWizard() {
        return this.#optionsWizard;
    }

    get playBtn() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.playButton);
    }

    get type() {
        return GameType.Bot;
    }



    init() {
        this.submissionPrevented = false;
        console.log("init bot wizard");
        // this.levelWizard = new LevelWizard(this.onLevelValidation.bind(this));
        // this.optionsSettings = new OptionsSettings();
        // this.#optionsWizard = new OptionsWizard(this.optionsSettings, this.generateOptionsControllers());
    }

    getOptionsControllerParams(type) {
        return {
            name: type,
            value: this.optionsSettings[type],
        };
    }

    generateOptionsControllers() {
        const controllers = [];
        Object.keys(this.optionsSettings).forEach(key => {
            const params = this.getOptionsControllerParams(key);
            controllers.push(new Switcher(params, this.onOptionSettingChange.bind(this)));
        });
        return controllers;
    }



    renderWizardContent(wizardContainer) {
        ElementHandler.clearContent(wizardContainer);
        // wizardContainer.append(this.levelWizard.renderWizard());
        // wizardContainer.append(this.optionsWizard.renderWizard());
    }

    onOptionSettingChange(params) {
        const updateData = {};
        updateData[params.name] = params.value;
        this.optionsSettings.update(updateData);
    }




    getWizardActionButtons() {
        const actionButtons = [];
        actionButtons.push(this.renderResetButton());
        //
        return actionButtons;
    }

    onReset() {
        this.init();
        this.wizardContainer.then(wizardContainer => this.renderWizardContent(wizardContainer));
    }

    onPlay() {
        const gameParams = this.gameSettings;
        gameParams.player = this.player;

        this.submitGame(new GameOriginal(gameParams));
    }

    updateSubmissionButton() {
        this.playBtn.then(btn => {
            ElementHandler.setDisabled(btn, this.submissionPrevented);
        });
    }

}
