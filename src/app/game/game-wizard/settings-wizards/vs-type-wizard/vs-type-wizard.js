"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DropdownSelect } from "UserInputs";

import { GameVSMode } from "Game";

import { SettingsWizardViewHelper } from "../settings-wizard-view-helper";

import { DOM_ELEMENT_CLASS, CONTENT } from "./vs-type-wizard.constants";

export class VSTypeWizard {
    #settings;
    #inputController;

    constructor(onVsTypeChange, vsType) {
        this.onVsTypeChange = onVsTypeChange;
        this.settings = vsType;
        this.initInputController();
    }

    set settings(vsType) {
        this.#settings = vsType;
    }

    get settings() {
        return this.#settings;
    }

    set inputController(inputController) {
        this.#inputController = inputController;
    }

    get inputController() {
        return this.#inputController;
    }

    initInputController() {
        const params = {
            name: "vsType",
            value: this.settings,
            options: this.typeOptions
        };
        this.inputController = new DropdownSelect(params, this.onVsTypeSelection.bind(this));
    }

    getTypeLabel(mode) {
        return CONTENT[mode].label;
    }

    get typeOptions() {
        const options = [];
        Object.values(GameVSMode).forEach(mode => {
            options.push({
                value: mode,
                innerHTML: `<span class="${DOM_ELEMENT_CLASS.optionLabel}">${this.getTypeLabel(mode)}</span>`
            });
        });
        return options;
    }

    get selectedTypeExplanation() {
        return CONTENT[this.settings].explanation;
    }

    renderWizard() {
        const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
        wizardContainer.append(this.renderlWizardInputs());
        const explanationContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.explanation], DOM_ELEMENT_CLASS.explanation);
        this.renderExplanation(explanationContainer);
        wizardContainer.append(explanationContainer);
        return wizardContainer;
    }

    renderExplanation(explanationContainer) {
        explanationContainer.innerHTML = this.selectedTypeExplanation;
    }

    get explanationContainer() {
        return ElementHandler.getByID(DOM_ELEMENT_CLASS.explanation);
    }

    renderlWizardInputs() {
        const fragment = document.createDocumentFragment();
        const dropdownInputField = this.inputController.generateInputField();
        const section = SettingsWizardViewHelper.generateWizardInputSection(this.inputController.name, dropdownInputField);
        fragment.append(section);
        return fragment;
    }

    onVsTypeSelection(params) {
        this.settings = params.value;
        this.explanationContainer.then(explanationContainer => this.renderExplanation(explanationContainer));
        this.onVsTypeChange(this.settings);
    }

}
