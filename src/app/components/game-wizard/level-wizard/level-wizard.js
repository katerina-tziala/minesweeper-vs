"use strict";

import { TYPOGRAPHY } from "../../../utils/constants/typography.constants";
import { ElementGenerator } from "../../../utils/element-generator";
import { ElementHandler } from "../../../utils/element-handler";
import { AriaHandler } from "../../../utils/aria-handler";


import { DOM_ELEMENT_CLASS, MENU_CONTENT } from "./level-wizard.constants";
import { GameType } from "../../../_enums/game-type.enum";
import { GameLevel } from "../../../_enums/game-level.enum";

import { DropdownSelect } from "../../user-input/dropdown-select/dropdown-select";

export class LevelWizard {

    constructor() {

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
            name: "level",
            value: "beginner",
            options: this.levelOptions
        };
        this.levelController = new DropdownSelect(params, this.onLevelChange.bind(this));
    }

    onLevelChange(selectedlevel) {
		console.log(selectedlevel);
    }


    generateLevelWizard() {
        const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
        wizardContainer.append(this.levelController.generateInputField());
        return wizardContainer;
    }



}
