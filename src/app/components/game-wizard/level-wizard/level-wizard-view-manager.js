"use strict";

import { TYPOGRAPHY } from "../../../_utils/constants/typography.constants";
import { ElementGenerator } from "../../../_utils/element-generator";
import { ElementHandler } from "../../../_utils/element-handler";

import { DOM_ELEMENT_CLASS, CONTENT } from "./level-wizard.constants";
import { GameLevel } from "../../../_enums/game-level.enum";

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
