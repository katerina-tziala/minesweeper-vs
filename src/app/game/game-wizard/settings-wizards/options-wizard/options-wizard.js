"use strict";

import { ElementGenerator } from "HTML_DOM_Manager";

import { UserInputsGroupController } from "UserInputs";

import { SettingsWizardViewHelper } from "../settings-wizard-view-helper";

import { DOM_ELEMENT_CLASS } from "./options-wizard.constants";


export class OptionsWizard {
    #settings;
    #inputsGroup;

    constructor(settings, controllers) {
        this.settings = settings;
        this.inputsGroup = controllers;
    }

    set inputsGroup(controllers) {
        this.#inputsGroup = new UserInputsGroupController();
        controllers.forEach(controller => this.#inputsGroup.inputControllers = controller);
    }

    get inputsGroup() {
        return this.#inputsGroup;
    }

    set settings(settings) {
        this.#settings = settings;
    }

    get settings() {
        return this.#settings;
    }

    renderWizard() {
        const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
        wizardContainer.append(this.renderlOptionsInputs());
        return wizardContainer;
    }

    renderlOptionsInputs() {
        const fragment = document.createDocumentFragment();
        this.inputsGroup.inputControllers.forEach(controller => {
            const inputField = controller.generateInputField();
            SettingsWizardViewHelper.generateWizardInputSection(fragment, controller.name, inputField, DOM_ELEMENT_CLASS.propertyContainer);
        });
        return fragment;
    }
}
