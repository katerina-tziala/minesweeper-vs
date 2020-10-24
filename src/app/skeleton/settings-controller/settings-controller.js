'use strict';

import { TYPOGRAPHY } from '../../utilities/constants/typography.constants';
import { SETTINGS_BTN } from '../../utilities/constants/btn-icon.constants';
import { ElementHandler } from '../../utilities/element-handler';
import { ElementGenerator } from '../../utilities/element-generator';

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT } from './settings-controller.constants';
import { THEME } from '../../utilities/enums/app-settings.enums';
import { Form } from '../../components/form/form';

import { Switcher } from '../../components/user-input/switcher/switcher';
import { LocalStorageHelper } from '../../utilities/local-storage-helper';

import { DOM_ELEMENT_ID as SKELETON_DOM_ELEMENT_ID, DOM_ELEMENT_CLASS as SKELETON_DOM_ELEMENT_CLASS } from '../../utilities/constants/ui.constants';
export class SettingsController {
    #settings;

    constructor(settings) {

        console.log(settings);
        this.settings = settings;
        this.initView();
        this.themeSwitcher = new Switcher('theme', false, this.onDarkThemeChange.bind(this));
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

            settingsPanel.append(this.themeSwitcher.generateInput())

            container.append(settingsBtn, settingsPanel);


        }, 1000);
    }


    toggleSettingsDisplay() {
        console.log("toggleSettingsDisplay");
    }






    onDarkThemeChange(params) {
        const selectedTheme = params.value ? THEME.Dark : THEME.Default;
        this.settings.theme = selectedTheme;
        this.saveSettings();
        this.setAppTheme();
    }


    saveSettings() {
        console.log(this.settings);
        // LocalStorageHelper.save('settings', this.settings);
    }


    setAppTheme() {
        const appStyles = `${SKELETON_DOM_ELEMENT_CLASS.app} ${SKELETON_DOM_ELEMENT_CLASS.theme}${this.settings.theme}`;
        ElementHandler.getByID(SKELETON_DOM_ELEMENT_ID.app).then(appContainer => {
            appContainer.className = appStyles;
        });
    }

}
