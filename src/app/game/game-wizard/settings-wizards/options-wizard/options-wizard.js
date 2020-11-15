"use strict";

import { ElementGenerator } from "HTML_DOM_Manager";

import { UserInputsGroupController, Switcher, NumberInput } from "UserInputs";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { clone } from "~/_utils/utils.js";

import { SettingsWizardViewHelper } from "../settings-wizard-view-helper";

import { DOM_ELEMENT_CLASS, LIMITS } from "./options-wizard.constants";


export class OptionsWizard {
    #settings;
    #inputsGroup;

    constructor(settings, onValidation) {
        this.settings = settings;
        this.inputsGroup = this.initOptionsControllers();
        this.onValidation = onValidation;
    }

    getOptionsControllerParams(type) {
        return {
            name: type,
            value: this.settings[type],
        };
    }

    initOptionsControllers() {
        const controllers = [];
        Object.keys(this.settings).forEach(key => {
            const params = this.getOptionsControllerParams(key);
            let controller;
            if (key === "openStrategy") {
                controller = new Switcher(params, this.onOpenStrategyChange.bind(this));
            } else if (key === "sneakPeek") {
                controller = new Switcher(params, this.onSneakPeekChange.bind(this));
                controller.disabled = this.settings.openStrategy;
            } else if (key === "sneakPeekDuration") {
                controller = new NumberInput(key, params.value.toString(), this.onSneakPeekDurationChange.bind(this));
                controller.boundaries = this.getSneekPeakDurationLimits();
                controller.disabled = this.settings.openStrategy ? true : !this.settings.sneakPeek;
            } else {
                controller = new Switcher(params, this.onOptionSettingChange.bind(this));
            }
            controllers.push(controller);
        });
        return controllers;
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
            const section = SettingsWizardViewHelper.generateWizardInputSection(controller.name, inputField, DOM_ELEMENT_CLASS.propertyContainer);
            fragment.append(section);
        });
        return fragment;
    }

    onOptionSettingChange(params) {
        const updateData = {};
        updateData[params.name] = params.value;
        this.settings.update(updateData);
        LocalStorageHelper.save("optionsSettings", this.settings);
    }

    onSneakPeekDurationChange(params) {
        if (params.valid) {
            this.onOptionSettingChange(params);
        }
        this.onValidation(params.valid);
    }

    onOpenStrategyChange(params) {
        this.onOptionSettingChange(params);
        if (params.value) {
            this.inputsGroup.getInputController("sneakPeek").disable();
            this.updateSneakPeekProperties();
        } else {
            this.inputsGroup.getInputController("sneakPeek").enable();
            this.updateSneakPeekProperties();
        }
    }

    onSneakPeekChange(params) {
        this.onOptionSettingChange(params);
        this.updateSneakPeekProperties();
    }


    updateSneakPeekProperties() {
        const sneakPeekController = this.inputsGroup.getInputController("sneakPeek");
        if (sneakPeekController.disabled) {
            this.disbleSneakPeekDurationController();
        } else {
            this.updateDurationControllerBasedOnSneakPeekValue();
        }
    }

    updateDurationControllerBasedOnSneakPeekValue() {
        const sneakPeekController = this.inputsGroup.getInputController("sneakPeek");
        const sneakPeekDurationController = this.inputsGroup.getInputController("sneakPeekDuration");
        sneakPeekDurationController.boundaries = this.getSneekPeakDurationLimits();
        if (sneakPeekController.value) {
            sneakPeekDurationController.enable();
        } else {
            this.disbleSneakPeekDurationController();
        }
    }

    getSneekPeakDurationLimits() {
        const limits = clone(LIMITS.sneakPeekDuration);
        if (!this.settings.sneakPeek) {
            limits.min = 0;
            this.settings.sneakPeekDuration = 0;
        }
        return limits;
    }

    disbleSneakPeekDurationController() {
        const sneakPeekDurationController = this.inputsGroup.getInputController("sneakPeekDuration");
        sneakPeekDurationController.disable();
        if (!sneakPeekDurationController.valid) {
            sneakPeekDurationController.value = this.settings.sneakPeekDuration.toString();
            sneakPeekDurationController.value = sneakPeekDurationController.getValueBasedOnStep().toString();
            sneakPeekDurationController.setFieldValue();
            sneakPeekDurationController.validateInputTypeValue();
            this.onNumberInputChange(sneakPeekDurationController.submissionProperties);
        }
    }



}
