"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { Switcher } from "UserInputs";

import { GameType, OptionsSettings, Player, GameOriginal } from "Game";

import { LevelWizard, OptionsWizard } from "./settings-wizards/settings-wizards";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, BUTTONS } from "./game-wizard.constants";

import { GameWizard } from "./game-wizard";

export class GameWizardOriginal extends GameWizard {
    #optionsSettings;
    #optionsWizard;

    constructor(onClose, submitGame) {
        super(onClose, submitGame)
        this.init();
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

    get wizardContainer() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.wizardContainer);
    }

    get type() {
        return GameType.Original;
    }



    init() {
        this.submissionPrevented = false;
        this.levelWizard = new LevelWizard(this.onLevelValidation.bind(this));
        this.optionsSettings = new OptionsSettings();
        this.#optionsWizard = new OptionsWizard(this.optionsSettings, this.generateOptionsControllers());
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
        wizardContainer.append(this.levelWizard.renderWizard());
        wizardContainer.append(this.optionsWizard.renderWizard());
    }

    onOptionSettingChange(params) {
        const updateData = {};
        updateData[params.name] = params.value;
        this.optionsSettings.update(updateData);
    }

    getWizardActionButtons() {
        const actionButtons = [];
        actionButtons.push(this.renderResetButton());
        actionButtons.push(ElementGenerator.generateButton(BUTTONS.play, this.onPlay.bind(this)));
        return actionButtons;
    }

    onReset() {
        this.init();
        this.wizardContent.then(wizardContent => this.renderWizardContent(wizardContent));
    }

    onPlay() {
        const gameParams = this.gameSettings;
        gameParams.player = this.player;
        this.submitGame(new GameOriginal(gameParams));
    }

    updateSubmissionButton() {
        this.playBtn.then(btn => ElementHandler.setDisabled(btn, this.submissionPrevented));
    }

}
