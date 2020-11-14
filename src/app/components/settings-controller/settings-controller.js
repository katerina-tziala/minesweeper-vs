"use strict";

import { DOM_ELEMENT_ID as APP_ELEMENTS_IDS, DOM_ELEMENT_CLASS as APP_STYLE_CLASS } from "../../_utils/constants/ui.constants";
import { Theme, SettingType } from "../../_enums/app-settings.enums";
import { AppSettingsModel } from "../../_models/app-settings";
import { ElementHandler } from "../../_utils/element-handler";
import { ElementGenerator } from "../../_utils/element-generator";
import { AriaHandler } from "../../_utils/aria-handler";
import { LocalStorageHelper } from "../../_utils/local-storage-helper";
import { clone, roundUpToNextDecade } from "../../_utils/utils";

import { DropdownSelect, Switcher } from "../../_lib_user-inputs/user-inputs.module";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, DROPDOWNS, SETTINGS_BTN } from "./settings-controller.constants";
import { SettingsOptionsHelper } from "./settings-options-helper";
import { SettingsViewHelper } from "./settings-view-helper";

export class SettingsController {
    #inputControllers;
    #settings;
    #gameSettingsHidden;
    #expanded;

    constructor() {
        this.#inputControllers = {};
        this.gameSettingsHidden = true;
        this.expanded = false;
        this.init();
    }

    get settings() {
        return this.#settings;
    }

    set settings(settings) {
        this.#settings = settings;
    }

    get expanded() {
        return this.#expanded;
    }

    set expanded(state) {
        this.#expanded = state;
    }

    get gameSettingsHidden() {
        return this.#gameSettingsHidden;
    }

    set gameSettingsHidden(state) {
        if (this.expanded) {
            this.collapseSettings();
        }
        this.#gameSettingsHidden = state;
    }

    set inputControllers(controller) {
        delete this.#inputControllers[controller.name];
        this.#inputControllers[controller.name] = controller;
    }

    get inputControllers() {
        return Object.values(this.#inputControllers);
    }

    get settingsContainer() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.container);
    }

    get settingsPanel() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.settingsPanel);
    }

    get settingsBtn() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.settingsBtn);
    }

    getInputController(key) {
        return this.#inputControllers[key];
    }

    init() {
        this.initSettings();
        this.initThemeTypeController();
        this.initMineTypeController();
        this.initColorController(SettingType.PlayerColorType, SettingType.OpponentColorType);
        this.initColorController(SettingType.OpponentColorType, SettingType.PlayerColorType);
        this.initView();
    }

    initSettings() {
        this.settings = new AppSettingsModel();
        const savedSettings = LocalStorageHelper.retrieve("settings");
        if (savedSettings) {
            this.settings.update(savedSettings);
        }
        this.saveSettings();
        this.setAppTheme();
    }

    initView() {
        this.settingsContainer.then(container => {
            const settingsBtn = ElementGenerator.generateButton(SETTINGS_BTN, this.toggleSettingsDisplay.bind(this));
            const settingsPanel = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.settingsPanel], DOM_ELEMENT_ID.settingsPanel);
            this.setPanelStyle(settingsPanel, 0);
            Object.values(SettingType).forEach(settingType => settingsPanel.append(this.renderSetting(settingType)));
            container.append(settingsBtn, settingsPanel);
        });
        this.collapseOnOutsideClick();
    }

    collapseOnOutsideClick() {
        document.addEventListener("click", (event) => {
            const settingsPanel = event.target.closest(".settings-panel");
            const toggleBtn = event.target.closest("#settings-toggle-btn");
            if (!toggleBtn && !settingsPanel && this.expanded) {
                this.expanded = false;
                this.collapseSettings();
            }
        });
    }

    getThemeTypeControllerParams(type) {
        return {
            name: type,
            value: this.settings[type],
            selectLabel: CONTENT[type],
        };
    }

    initThemeTypeController() {
        const params = this.getThemeTypeControllerParams(SettingType.Theme);
        params.value = this.settings.theme === Theme.Dark;
        this.inputControllers = new Switcher(params, this.onDarkThemeChange.bind(this));
    }

    initMineTypeController() {
        const params = this.getThemeTypeControllerParams(SettingType.MineType);
        params.options = SettingsOptionsHelper.getMineTypeOptions();
        this.inputControllers = new DropdownSelect(params, this.onDropdownChange.bind(this), this.onDropdownExpanded.bind(this));
    }

    initColorController(settingName, settingToCheckName) {
        const params = this.getThemeTypeControllerParams(settingName);
        params.options = SettingsOptionsHelper.getAllowedColorOptions(this.settings[settingToCheckName]);
        this.inputControllers = new DropdownSelect(params, this.onDropdownChange.bind(this), this.onDropdownExpanded.bind(this));
    }

    renderSetting(key) {
        const settingsSection = SettingsViewHelper.generateSettingSection(key);
        settingsSection.append(this.getInputController(key).generateInputField());
        return settingsSection;
    }

    toggleSettingsDisplay() {
        this.expanded = !this.expanded;
        this.expanded ? this.expandSettings() : this.collapseSettings();
    }

    expandSettings() {
        let height = 0;
        this.settingsPanel.then(panel => {
            const settingsSections = panel.childNodes;
            height += roundUpToNextDecade(settingsSections[0].getBoundingClientRect().height);
            height += this.getGameSettingsHeight(settingsSections);
            this.setPanelStyle(panel, height);
        });
        this.setSettingsButtonState();
    }

    getGameSettingsHeight(settingsSections) {
        let height = 0;
        for (let index = 1; index < settingsSections.length; index++) {
            const settingsSection = settingsSections[index];
            if (this.gameSettingsHidden) {
                ElementHandler.hide(settingsSection);
            } else {
                ElementHandler.display(settingsSection);
                height += roundUpToNextDecade(settingsSection.getBoundingClientRect().height);
            }
        }
        return (height === 0) ? 12 : height;
    }

    collapseSettings() {
        this.settingsPanel.then(panel => this.setPanelStyle(panel, 0));
        this.setSettingsButtonState();
    }

    setPanelStyle(panel, height) {
        clearTimeout(this.transitionTimeout);
        panel.style.height = `${height}px`;
        if (height) {
            this.transitionTimeout = setTimeout(() => panel.style.overflow = "visible", 500);
        } else {
            panel.style.overflow = "hidden";
        }
    }

    setSettingsButtonState() {
        this.settingsBtn.then(btn => AriaHandler.setAriaExpanded(btn, this.expanded));
    }

    onDropdownExpanded(expandedName) {
        const toCollapse = DROPDOWNS.filter(type => type !== expandedName);
        toCollapse.forEach(type => this.getInputController(type).collapseDropdown());
    }

    onDarkThemeChange(params) {
        const selectedTheme = params.value ? Theme.Dark : Theme.Default;
        this.settings.theme = selectedTheme;
        this.saveSettings();
        this.setAppTheme();
    }

    saveSettings() {
        LocalStorageHelper.save("settings", clone(this.settings));
    }

    setAppTheme() {
        const appStyles = `${APP_STYLE_CLASS.app} ${APP_STYLE_CLASS.theme}${this.settings.theme}`;
        ElementHandler.getByID(APP_ELEMENTS_IDS.app).then(appContainer => appContainer.className = appStyles);
    }

    onDropdownChange(params) {
        this.settings[params.name] = params.value;
        if (params.name === SettingType.PlayerColorType) {
            this.updateColorDropdown(SettingType.PlayerColorType, SettingType.OpponentColorType);
        } else if (params.name === SettingType.OpponentColorType) {
            this.updateColorDropdown(SettingType.OpponentColorType, SettingType.PlayerColorType);
        }
        this.saveSettings();
    }

    updateColorDropdown(changedField, fieldToUpdate) {
        const newOptions = SettingsOptionsHelper.getAllowedColorOptions(this.settings[changedField]);
        this.getInputController(fieldToUpdate).updateOptions(newOptions);
    }

}
