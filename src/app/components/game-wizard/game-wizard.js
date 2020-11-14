"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";


import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS, MENU_CONTENT } from "./game-wizard.constants";
import { GameType } from "../../_enums/game-type.enum";
import { GameLevel } from "../../_enums/game-level.enum";

import { Form } from "../form/form";
import { LevelWizard } from "./level-wizard/level-wizard";
import { LevelSettings } from "../../_models/level-settings/level-settings";


export class GameWizard {

    constructor() {

    }


    generateWizard() {
        const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
        const tere = new LevelWizard(new LevelSettings(GameLevel.Custom));


        wizardContainer.append(tere.generateLevelWizard());

        return wizardContainer;
    }




}
