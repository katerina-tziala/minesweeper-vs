"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { Switcher } from "UserInputs";

import { GameType, OptionsSettings, Player, GameOriginal } from "Game";

import { LevelWizard, OptionsWizard } from "../settings-wizards/settings-wizards";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, BUTTONS } from "../game-wizard.constants";

export class GameWizard {
    #levelWizard;
    #optionsSettings;
    #optionsWizard;

    constructor(onClose, submitGame) {
        this.onClose = onClose;
        this.submitGame = submitGame;
    }

    set levelWizard(levelWizard) {
        this.#levelWizard = levelWizard;
    }

    get levelWizard() {
        return this.#levelWizard;
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

    get wizardContent() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.wizardContent);
    }

    get player() {
        return new Player(self.user.id, self.user.username, self.settingsController.settings.playerColorType);
    }

    get gameSettings() {
        return {
            id: this.type,
            levelSettings: this.levelWizard.getLevelSettings(),
            optionsSettings: this.optionsWizard.settings
        };
    }

    // init() {
    //     this.submissionPrevented = false;
    //     this.#levelWizard = new LevelWizard(this.onLevelValidation.bind(this));
    //     this.optionsSettings = new OptionsSettings();
    //     this.#optionsWizard = new OptionsWizard(this.optionsSettings, this.generateOptionsControllers());
    // }

    // getOptionsControllerParams(type) {
    //     return {
    //         name: type,
    //         value: this.optionsSettings[type],
    //     };
    // }

    // generateOptionsControllers() {
    //     const controllers = [];
    //     Object.keys(this.optionsSettings).forEach(key => {
    //         const params = this.getOptionsControllerParams(key);
    //         controllers.push(new Switcher(params, this.onOptionSettingChange.bind(this)));
    //     });
    //     return controllers;
    // }

    generateWizard() {
        const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
        wizardContainer.append(this.generateWizardHeader());
        const wizardContent = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContent], DOM_ELEMENT_CLASS.wizardContent);
        this.renderWizardContent(wizardContent);
        wizardContainer.append(wizardContent);
        wizardContainer.append(this.generateWizardActions());
        return wizardContainer;
    }


    // renderWizardContent(wizardContainer) {
    //     ElementHandler.clearContent(wizardContainer);
    //     wizardContainer.append(this.generateWizardHeader());
    //     wizardContainer.append(this.levelWizard.renderWizard());
    //     wizardContainer.append(this.optionsWizard.renderWizard());
    //     wizardContainer.append(this.generateWizardActions());
    // }

    // onOptionSettingChange(params) {
    //     const updateData = {};
    //     updateData[params.name] = params.value;
    //     this.optionsSettings.update(updateData);
    // }

    generateWizardHeader() {
        const wizardHeader = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardHeader]);
        const closeBnt = ElementGenerator.generateButton(BUTTONS.close, this.onClose.bind(this));
        wizardHeader.append(this.generateWizardTitle(), closeBnt);
        return wizardHeader;
    }

    generateWizardTitle() {
        const wizardTitle = document.createElement("h2");
        wizardTitle.innerHTML = CONTENT[this.type];
        return wizardTitle;
    }

    renderResetButton() {
        return ElementGenerator.generateButton(BUTTONS.reset, this.onReset.bind(this));
    }

    generateWizardActions() {
        const actionsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.actionsContainer]);
        const buttons = this.getWizardActionButtons();
        buttons.forEach(button => actionsContainer.append(button));
        return actionsContainer;
    }

    onLevelValidation(valid) {
        if (this.submissionPrevented !== !valid) {
            this.submissionPrevented = !valid;
            this.updateSubmissionButton();
        }
    }


    renderWizardContent(wizardContainer) { }
    getWizardActionButtons() { }
    updateSubmissionButton() { }
}
