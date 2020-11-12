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
        this.initLevelSettingsController();
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

    initLevelSettingsController() {
        Object.keys(LEVEL_SETTINGS_PROPERTIES).forEach(levelProperty => {
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
        Object.keys(LEVEL_SETTINGS_PROPERTIES).forEach(levelProperty => {
            const propertyTag = LevelWizardViewManager.generatePropertyTag(levelProperty);
            const propertyContainer = LevelWizardViewManager.generatePropertyContainer(levelProperty);
            let inputField;
            if (levelProperty === LEVEL_SETTINGS_PROPERTIES.level) {
                inputField = this.levelController.generateInputField();
            } else {
                inputField = this.getLevelSettingController(levelProperty).generateInputField();
            }
            propertyContainer.append(inputField);
            fragment.append(propertyTag, propertyContainer);
        });
        return fragment;
    }


    onLevelChange(selectedlevel) {
        console.log(selectedlevel);
    }

    onCustomLevelParamChange(params) {
        console.log(params);
    }






}
