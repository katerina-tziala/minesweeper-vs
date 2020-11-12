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




export class LevelWizard {

    constructor(settings) {

        this.settings = new LevelSettings();
        if (settings) {
            this.settings.update(settings);
        }
        this.initLevelController();
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

    //initialize settings
    initLevelController() {
        const params = {
            name: LEVEL_SETTINGS_PROPERTIES.level,
            value: this.settings.level,
            options: this.levelOptions
        };
        this.levelController = new DropdownSelect(params, this.onLevelChange.bind(this));
    }

    onLevelChange(selectedlevel) {
        console.log(selectedlevel);
    }


    generateLevelWizard() {
        const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
        Object.keys(LEVEL_SETTINGS_PROPERTIES).forEach(levelProperty => {
            const propertyTag = LevelWizardViewManager.generatePropertyTag(levelProperty);
            const propertyContainer = LevelWizardViewManager.generatePropertyContainer(levelProperty);
            // if (levelProperty === l) {

            // } else {

            // }
            console.log(levelProperty);

            wizardContainer.append(propertyTag, propertyContainer);
        });
        //wizardContainer.append(this.levelController.generateInputField());
        return wizardContainer;
    }



}
