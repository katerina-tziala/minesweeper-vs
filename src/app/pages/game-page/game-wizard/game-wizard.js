"use strict";

import { ElementGenerator } from "HTML_DOM_Manager";
import { OptionsSettings, Player } from "GameModels";
import { Switcher } from "UserInputs";

import { LevelWizard } from "./level-wizard/level-wizard";
import { OptionsWizard } from "./options-wizard/options-wizard";

import { DOM_ELEMENT_CLASS, CONTENT, CLOSE_BTN } from "./game-wizard.constants";

export class GameWizard {
    #levelWizard;
    #optionsSettings;
    #optionsWizard;

    constructor() {
        this.#levelWizard = new LevelWizard();
        this.optionsSettings = new OptionsSettings();
        this.#optionsWizard = new OptionsWizard(this.optionsSettings, this.generateOptionsControllers());
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
        const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
        wizardContainer.append(this.generateWizardHeader());
        wizardContainer.append(this.levelWizard.renderWizard());
        wizardContainer.append(this.optionsWizard.renderWizard());
        return wizardContainer;
    }

    onOptionSettingChange(params) {
        const updateData = {};
        updateData[params.name] = params.value;
        this.optionsSettings.update(updateData);
    }

    generateWizardHeader() {
        const wizardHeader = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardHeader]);
        const closeBnt = ElementGenerator.generateButton(CLOSE_BTN, this.closeWizard.bind(this));
        wizardHeader.append(this.generateWizardTitle(), closeBnt);
        return wizardHeader;
    }

    generateWizardTitle() {
        const wizardTitle = document.createElement("h2");
        wizardTitle.innerHTML = CONTENT.wizardTitle;
        return wizardTitle;
    }

    closeWizard() {
      console.log("closeWizard");
    }



}
