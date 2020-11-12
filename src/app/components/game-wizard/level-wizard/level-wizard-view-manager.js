"use strict";

import { TYPOGRAPHY } from "../../../utils/constants/typography.constants";
import { ElementGenerator } from "../../../utils/element-generator";
import { ElementHandler } from "../../../utils/element-handler";
import { AriaHandler } from "../../../utils/aria-handler";


import { DOM_ELEMENT_CLASS, LEVEL_SETTINGS_PROPERTIES, CONTENT } from "./level-wizard.constants";
import { GameType } from "../../../_enums/game-type.enum";
import { GameLevel } from "../../../_enums/game-level.enum";
import { LevelSettings } from "../../../_models/level-settings/level-settings";

import { DropdownSelect } from "../../user-input/dropdown-select/dropdown-select";

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

}
