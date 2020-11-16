"use strict";

import { Switcher, NumberInput } from "UserInputs";

import { clone } from "~/_utils/utils.js";

import { LIMITS } from "./options-wizard.constants";

import { OptionsWizard } from "./options-wizard";

export class OptionsWizardVS extends OptionsWizard {

    constructor(settings, onValidation) {
        super(settings, onValidation);
    }

    generateOpenStrategySwitcher() {
        const params = this.getOptionsControllerParams("openStrategy");
        return new Switcher(params, this.onOpenStrategyChange.bind(this));
    }

    generateSneakPeekSwitcher() {
        const params = this.getOptionsControllerParams("sneakPeek");
        const controller = new Switcher(params, this.onSneakPeekChange.bind(this));
        controller.disabled = this.settings.openStrategy;
        return controller;
    }

    generateSneakPeekDurationInput() {
        const controller = new NumberInput("sneakPeekDuration", this.settings.sneakPeekDuration.toString(), this.onSneakPeekDurationChange.bind(this));
        controller.boundaries = this.getSneekPeakDurationLimits();
        controller.disabled = this.settings.openStrategy ? true : !this.settings.sneakPeek;
        return controller;
    }

    generateSettingController(key) {
        let controller;
        switch (key) {
            case "openStrategy":
                controller = this.generateOpenStrategySwitcher();
                return controller;
            case "sneakPeek":
                controller = this.generateSneakPeekSwitcher();
                return controller;
            case "sneakPeekDuration":
                controller = this.generateSneakPeekDurationInput();
                return controller;
            default:
                controller = this.generateDefaultSwitcher(key);
                return controller;
        }
    }

    initOptionsControllers() {
        const controllers = [];
        Object.keys(this.settings).forEach(key => controllers.push(this.generateSettingController(key)));
        return controllers;
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
