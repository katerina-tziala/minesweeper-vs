"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS, CONTENT } from "./game-wizard.constants";

export class WizardViewManager {

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

    static generateWizardInputSection(fragment, propertyName, inputField, propertyClass) {
        const propertyTag = WizardViewManager.generatePropertyTag(propertyName);
        const propertyContainer = WizardViewManager.generatePropertyContainer(propertyName);
        if (propertyClass) {
            ElementHandler.addStyleClass(propertyContainer, propertyClass);
        }
        propertyContainer.append(inputField);
        fragment.append(propertyTag, propertyContainer);
    }

    static updateControllerContainer(controller, isCustomLevel) {
        const propertyContainerID = WizardViewManager.getPropertyContainerID(controller.name);
        ElementHandler.getByID(propertyContainerID).then(propertyContainer => {
            ElementHandler.clearContent(propertyContainer);
            controller.disabled = !isCustomLevel;
            const inputField = controller.generateInputField();
            propertyContainer.append(inputField);
        });
    }

}
