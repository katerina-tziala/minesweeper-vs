"use strict";

import { ElementGenerator } from "HTML_DOM_Manager";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { clone } from "~/_utils/utils";

import { UserInputsGroupController, DropdownSelect, NumberInput } from "UserInputs";

import { GameLevel, LevelSettings } from "Game";

import { SettingsWizardViewHelper } from "../settings-wizard-view-helper";

import { DOM_ELEMENT_CLASS, LEVEL_SETTINGS_PROPERTIES, LIMITS } from "./level-wizard.constants";

export class LevelWizard {
    #settings;
    #inputsGroup;

    constructor(onLevelValidation, settings) {
        this.onLevelValidation = onLevelValidation;
        this.settings = settings;
        this.#inputsGroup = new UserInputsGroupController();
        this.initLevelController();
        this.initLevelSettingsControllers();
    }

    get inputsGroup() {
        return this.#inputsGroup;
    }

    set settings(settings) {
        this.#settings = new LevelSettings();
        if (settings) {
            this.#settings.update(settings);
        }
    }

    get settings() {
        return this.#settings;
    }

    get levelProperties() {
        return Object.keys(LEVEL_SETTINGS_PROPERTIES).filter(key => LEVEL_SETTINGS_PROPERTIES[key] !== LEVEL_SETTINGS_PROPERTIES.level);
    }

    get isCustomLevel() {
        return this.settings.level === GameLevel.Custom;
    }

    get numberOfMinesBoundaries() {
        if (this.isCustomLevel) {
            const numberOfBoardTiles = this.settings.rows * this.settings.columns;
            const boundaries = clone(LIMITS.numberOfMines);
            boundaries.max = Math.floor(numberOfBoardTiles * LIMITS.maxMinesPercentage);
            boundaries.min = Math.ceil(numberOfBoardTiles * LIMITS.minMinesPercentage);
            return boundaries;
        }
        return undefined;
    }

    get levelSettingsControllers() {
        return this.inputsGroup.inputControllers.filter(controller => controller.name !== LEVEL_SETTINGS_PROPERTIES.level);
    }

    get levelOptions() {
        const options = [];
        Object.values(GameLevel).forEach(level => {
            options.push({
                value: level,
                innerHTML: `<span class="level-option">${level}</span>`
            });
        });
        return options;
    }

    getPropertyBoundaries(levelProperty) {
        if (levelProperty !== LEVEL_SETTINGS_PROPERTIES.numberOfMines) {
            return LIMITS.customLevelBoard;
        }
        return this.numberOfMinesBoundaries;
    }

    initLevelController() {
        const params = {
            name: LEVEL_SETTINGS_PROPERTIES.level,
            value: this.settings.level,
            options: this.levelOptions
        };
        this.inputsGroup.inputControllers = new DropdownSelect(params, this.onLevelChange.bind(this));
    }

    initLevelSettingsControllers() {
        this.levelProperties.forEach(levelProperty => {
            const controller = new NumberInput(levelProperty, this.settings[levelProperty].toString(), this.onCustomLevelParamChange.bind(this));
            controller.boundaries = this.getPropertyBoundaries(levelProperty);
            this.inputsGroup.inputControllers = controller;
        });
    }

    renderWizard() {
        const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
        wizardContainer.append(this.renderlWizardInputs());
        return wizardContainer;
    }

    renderlWizardInputs() {
        const fragment = document.createDocumentFragment();
        const levelInput = this.inputsGroup.getInputController(LEVEL_SETTINGS_PROPERTIES.level).generateInputField();
        const levelSection = SettingsWizardViewHelper.generateWizardInputSection(LEVEL_SETTINGS_PROPERTIES.level, levelInput, DOM_ELEMENT_CLASS.propertyContainer);
        fragment.append(levelSection);
        this.levelSettingsControllers.forEach(controller => {
            controller.disabled = !this.isCustomLevel;
            const inputField = controller.generateInputField();
             const section = SettingsWizardViewHelper.generateWizardInputSection(controller.name, inputField, DOM_ELEMENT_CLASS.propertyContainer);
            fragment.append(section);
        });
        return fragment;
    }

    onLevelChange(params) {
        this.settings.setLevel(params.value);
        LocalStorageHelper.save("levelSettings", this.settings);
        if (this.isCustomLevel) {
            const currentCustomLevelSettings = LocalStorageHelper.retrieve("levelSettings");
            if (currentCustomLevelSettings) {
                this.settings.update(currentCustomLevelSettings);
            }
        }
        this.initLevelSettingsControllers();
        this.levelSettingsControllers.forEach(controller => {
            SettingsWizardViewHelper.updateControllerContainer(controller, this.isCustomLevel);
        });
    }

    onCustomLevelParamChange(params) {
        const restSettingsControllers = this.levelSettingsControllers.filter(controller => controller.name !== params.name);
        if (!params.valid) {
            LocalStorageHelper.remove("levelSettings");
            restSettingsControllers.forEach(controller => controller.disable());
            this.onLevelValidation(false);
            return;
        }
        this.onLevelValidation(true);
        this.updateCustomLevel(params);
        const disabledControllers = restSettingsControllers.filter(controller => controller.disabled);
        disabledControllers.forEach(controller => controller.enable());
        if (params.name !== LEVEL_SETTINGS_PROPERTIES.numberOfMines) {
            const numberOfMinesController = this.inputsGroup.getInputController(LEVEL_SETTINGS_PROPERTIES.numberOfMines);
            numberOfMinesController.boundaries = this.numberOfMinesBoundaries;
            numberOfMinesController.validateInputTypeValue();
        }
    }

    updateCustomLevel(params) {
        const settingsUpdate = {};
        settingsUpdate[params.name] = params.value;
        this.settings.update(settingsUpdate);
        LocalStorageHelper.save("levelSettings", this.settings);
    }

}
