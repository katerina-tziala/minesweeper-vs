"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS, CONTENT } from "./game-settings-wizards.constants";

export class GameSettingsWizardViewHelper {

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

    static generateWizardInputSection(propertyName, inputField, propertyClass) {
        const sectionContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.sectionContainer]);
        const propertyTag = SettingsWizardViewHelper.generatePropertyTag(propertyName);
        const propertyContainer = SettingsWizardViewHelper.generatePropertyContainer(propertyName);
        if (propertyClass) {
            ElementHandler.addStyleClass(propertyContainer, propertyClass);
        }
        propertyContainer.append(inputField);
        sectionContainer.append(propertyTag, propertyContainer);
        return sectionContainer;
    }

    static updateControllerContainer(controller, isCustomLevel) {
        const propertyContainerID = SettingsWizardViewHelper.getPropertyContainerID(controller.name);
        ElementHandler.getByID(propertyContainerID).then(propertyContainer => {
            ElementHandler.clearContent(propertyContainer);
            controller.disabled = !isCustomLevel;
            const inputField = controller.generateInputField();
            propertyContainer.append(inputField);
        });
    }

}
