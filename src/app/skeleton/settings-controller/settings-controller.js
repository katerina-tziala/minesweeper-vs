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

    get settingsPanel() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.settingsPanel);
    }

    initView() {
        this.settingsContainer.then(container => {
            console.log(container);
            const settingsBtn = ElementGenerator.generateButton(SETTINGS_BTN, this.toggleSettingsDisplay.bind(this));
            const settingsPanel = ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.settingsPanel);
            ElementHandler.setID(settingsPanel, DOM_ELEMENT_ID.settingsPanel);
            container.append(settingsBtn, settingsPanel);
        });
    }


    toggleSettingsDisplay() {
        console.log("toggleSettingsDisplay");
    }


    toggleSettingsDisplay() {
        console.log("toggleSettingsDisplay");
    }
}
