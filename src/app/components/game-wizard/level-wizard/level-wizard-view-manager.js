"use strict";

import { TYPOGRAPHY } from "../../../utils/constants/typography.constants";
import { ElementGenerator } from "../../../utils/element-generator";
import { ElementHandler } from "../../../utils/element-handler";
import { AriaHandler } from "../../../utils/aria-handler";


import { DOM_ELEMENT_CLASS, LEVEL_SETTINGS_PROPERTIES, CONTENT } from "./level-wizard.constants";
import { GameType } from "../../../_enums/game-type.enum";
import { GameLevel } from "../../../_enums/game-level.enum";
import { LevelSettings } from "../../../_models/level-settings/level-settings";


export class LevelWizardViewManager {


    static generatePropertyTag(propertyName) {
        const propertyTag = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.propertyTag]);
        propertyTag.innerHTML = CONTENT[propertyName];
        return propertyTag;
    }

    static getPropertyContainerID(propertyName) {
        return DOM_ELEMENT_CLASS.propertyContainer + TYPOGRAPHY.doubleUnderscore + propertyName;
    }

    static generatePropertyContainer(propertyName) {
        const propertyContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.propertyContainer], this.getPropertyContainerID(propertyName));
        return propertyContainer;
    }

    static levelOptions() {
        const options = [];
        Object.values(GameLevel).forEach(level => {
            options.push({
                value: level,
                innerHTML: `<span class="level-option">${level}</span>`
            });
        });
        return options;
    }

    static generateWizardInputSection(fragment, propertyName, inputField) {
        const propertyTag = LevelWizardViewManager.generatePropertyTag(propertyName);
        const propertyContainer = LevelWizardViewManager.generatePropertyContainer(propertyName);
        propertyContainer.append(inputField);
        fragment.append(propertyTag, propertyContainer);
    }

    static updateControllerContainer(controller, isCustomLevel) {
        const propertyContainerID = LevelWizardViewManager.getPropertyContainerID(controller.name);
        ElementHandler.getByID(propertyContainerID).then(propertyContainer => {
            ElementHandler.clearContent(propertyContainer);
            controller.disabled = !isCustomLevel;
            const inputField = controller.generateInputField();
            propertyContainer.append(inputField);
        });
    }

}
