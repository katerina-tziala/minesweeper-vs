'use strict';

import { TYPOGRAPHY } from '../../utilities/constants/typography.constants';
import { SETTINGS_BTN } from '../../utilities/constants/btn-icon.constants';
import { ElementHandler } from '../../utilities/element-handler';
import { ElementGenerator } from '../../utilities/element-generator';

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from './settings-controller.constants';
import { THEME } from '../../utilities/enums/app-settings.enums';
import { Form } from '../../components/form/form';


export class SettingsController {
    #settings;

    constructor(settings) {
        console.log("hey");
        console.log(settings);
        this.settings = settings;
        this.initView();
        // this.form = new Form(onFormSubmission);
    }

    get settings() {
        return this.#settings;
    }

    set settings(settings) {
        return this.#settings = settings;
    }

    get settingsContainer() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.container);
    }

    initView() {
        this.settingsContainer.then(container => {
            console.log(container);


            container.append(ElementGenerator.generateButton(SETTINGS_BTN, this.toggleSettingsDisplay.bind(this)))
        });
    }


    toggleSettingsDisplay() {
        console.log("toggleSettingsDisplay");
    }


    toggleSettingsDisplay() {
        console.log("toggleSettingsDisplay");
    }
}
