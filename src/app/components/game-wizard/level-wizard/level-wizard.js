"use strict";

import { TYPOGRAPHY } from "../../../_utils/constants/typography.constants";
import { ElementGenerator } from "../../../_utils/element-generator";
import { ElementHandler } from "../../../_utils/element-handler";
import { AriaHandler } from "../../../_utils/aria-handler";
import { LocalStorageHelper } from "../../../_utils/local-storage-helper";

import { clone } from "../../../_utils/utils";

import { GameType } from "../../../_enums/game-type.enum";
import { GameLevel } from "../../../_enums/game-level.enum";
import { LevelSettings } from "../../../_models/level-settings/level-settings";

import { DropdownSelect, NumberInput } from "../../../_lib_user-inputs/user-inputs.module";

import { DOM_ELEMENT_CLASS, LEVEL_SETTINGS_PROPERTIES, LIMITS } from "./level-wizard.constants";
import { LevelWizardViewManager } from "./level-wizard-view-manager";

export class LevelWizard {
    #settings;
    #levelController;
    #levelSettingsControllers = {};

    constructor(settings) {
        this.settings = settings;
        this.initLevelController();
        this.initLevelSettingsControllers();
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

    set levelController(controller) {
        this.#levelController = controller;
    }

    get levelController() {
        return this.#levelController;
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

    set levelSettingsControllers(controller) {
        delete this.#levelSettingsControllers[controller.name];
        this.#levelSettingsControllers[controller.name] = controller;
    }

    get levelSettingsControllers() {
        return Object.values(this.#levelSettingsControllers);
    }

    getSettingsController(key) {
		return this.#levelSettingsControllers[key];
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
            options: LevelWizardViewManager.levelOptions()
        };
        this.levelController = new DropdownSelect(params, this.onLevelChange.bind(this));
    }

    initLevelSettingsControllers() {
        this.levelProperties.forEach(levelProperty => {
            const controller = new NumberInput(levelProperty, this.settings[levelProperty].toString(), this.onCustomLevelParamChange.bind(this));
            controller.boundaries = this.getPropertyBoundaries(levelProperty);
            this.levelSettingsControllers = controller;
        });
    }

    generateLevelWizard() {
        const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
        wizardContainer.append(this.generateLevelWizardInputs());
        return wizardContainer;
    }

    generateLevelWizardInputs() {
        const fragment = document.createDocumentFragment();
        LevelWizardViewManager.generateWizardInputSection(fragment, LEVEL_SETTINGS_PROPERTIES.level, this.levelController.generateInputField());
        this.levelSettingsControllers.forEach(controller => {
            controller.disabled = !this.isCustomLevel;
            const inputField = controller.generateInputField();
            LevelWizardViewManager.generateWizardInputSection(fragment, controller.name, inputField);
        });
        return fragment;
    }

    onLevelChange(params) {
        this.settings.setLevel(params.value);
        if (this.isCustomLevel) {
            const currentCustomLevelSettings = LocalStorageHelper.retrieve("levelSettings");
            if (currentCustomLevelSettings) {
                this.settings.update(currentCustomLevelSettings);
            }
        }
        this.initLevelSettingsControllers();
        this.levelSettingsControllers.forEach(controller => {
            LevelWizardViewManager.updateControllerContainer(controller, this.isCustomLevel);
        });
    }

    onCustomLevelParamChange(params) {
        const restSettingsControllers = this.levelSettingsControllers.filter(controller => controller.name !== params.name);
        if (!params.valid) {
            LocalStorageHelper.remove("levelSettings");
            restSettingsControllers.forEach(controller => controller.disable());
            return;
        }
        // valid input
        this.updateCustomLevel(params);
        const disabledControllers = restSettingsControllers.filter(controller => controller.disabled);
        disabledControllers.forEach(controller => controller.enable());
        if (params.name !== LEVEL_SETTINGS_PROPERTIES.numberOfMines) {
            const numberOfMinesController = this.getSettingsController(LEVEL_SETTINGS_PROPERTIES.numberOfMines);
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
