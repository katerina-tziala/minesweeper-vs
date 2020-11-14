"use strict";

import { TYPOGRAPHY } from "../../../utils/constants/typography.constants";
import { ElementGenerator } from "../../../utils/element-generator";
import { ElementHandler } from "../../../utils/element-handler";
import { AriaHandler } from "../../../utils/aria-handler";


import { DOM_ELEMENT_CLASS, LEVEL_SETTINGS_PROPERTIES, CONTENT } from "./level-wizard.constants";

import { LevelWizardViewManager } from "./level-wizard-view-manager";


import { GameType } from "../../../_enums/game-type.enum";
import { GameLevel } from "../../../_enums/game-level.enum";
import { LevelSettings } from "../../../_models/level-settings/level-settings";

import { DropdownSelect } from "../../user-input/dropdown-select/dropdown-select";
import { NumberInput } from "../../user-input/number-input/number-input";




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
            this.settings.update(settings);
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

    set levelSettingsControllers(controller) {
        delete this.#levelSettingsControllers[controller.name];
        this.#levelSettingsControllers[controller.name] = controller;
    }

    get levelSettingsControllers() {
        return Object.values(this.#levelSettingsControllers);
    }

    get levelProperties() {
        return Object.keys(LEVEL_SETTINGS_PROPERTIES).filter(key => LEVEL_SETTINGS_PROPERTIES[key] !== LEVEL_SETTINGS_PROPERTIES.level);
    }

    get isCustomLevel() {
        return this.settings.level === GameLevel.Custom;
    }

    getLevelSettingController(key) {
        return this.#levelSettingsControllers[key];
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
            this.levelSettingsControllers = new NumberInput(levelProperty, this.settings[levelProperty].toString(), this.onCustomLevelParamChange.bind(this));
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
        //if custom check for previously set values
        this.initLevelSettingsControllers();
        this.levelSettingsControllers.forEach(controller => {
            LevelWizardViewManager.updateControllerContainer(controller, this.isCustomLevel);
        });
    }

    onCustomLevelParamChange(params) {
        console.log(params);
    }






}
