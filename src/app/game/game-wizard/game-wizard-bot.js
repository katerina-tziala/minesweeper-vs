"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { Switcher } from "UserInputs";

import { GameType, OptionsSettings, Player, GameOriginal } from "Game";

import { LevelWizard, OptionsWizard } from "./settings-wizards/settings-wizards";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, BUTTONS } from "./game-wizard.constants";

import { GameWizard } from "./game-wizard";

export class GameWizardBot extends GameWizard {
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
        return GameType.Bot;
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

    generateWizard() {
        const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer], DOM_ELEMENT_ID.wizardContainer);
        this.renderWizardContent(wizardContainer);
        return wizardContainer;
    }

    renderWizardContent(wizardContainer) {
        ElementHandler.clearContent(wizardContainer);
        wizardContainer.append(this.generateWizardHeader());
        wizardContainer.append(this.levelWizard.renderWizard());
        wizardContainer.append(this.optionsWizard.renderWizard());
        wizardContainer.append(this.generateWizardActions());
    }

    onOptionSettingChange(params) {
        const updateData = {};
        updateData[params.name] = params.value;
        this.optionsSettings.update(updateData);
    }




    generateWizardActions() {
        const actionsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.actionsContainer]);
        const clearBtn = ElementGenerator.generateButton(BUTTONS.clear, this.onReset.bind(this));
        const playBtn = ElementGenerator.generateButton(BUTTONS.play, this.onPlay.bind(this));
        actionsContainer.append(clearBtn, playBtn);
        return actionsContainer;
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
