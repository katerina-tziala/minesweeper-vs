"use strict";

import { DOM_ELEMENT_ID as APP_ELEMENTS_IDS, DOM_ELEMENT_CLASS as APP_STYLE_CLASS } from "~/_constants/ui.constants";
import { Theme, SettingType } from "~/_enums/app-settings.enums";
import { AppSettingsModel } from "../../_models/app-settings";

import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { clone, roundUpToNextDecade } from "~/_utils/utils";

import { UserInputsGroupController, DropdownSelect, Switcher } from "UserInputs";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, DROPDOWNS, SETTINGS_BTN } from "./settings-controller.constants";
import { SettingsOptionsHelper } from "./settings-options-helper";
import { SettingsViewHelper } from "./settings-view-helper";

export class SettingsController {
    #settings;
    #gameSettingsHidden;
    #expanded;
    #inputsGroup;

    constructor() {
        this.#inputsGroup = new UserInputsGroupController();
        this.gameSettingsHidden = true;
        this.expanded = false;
        this.init();
    }

    get inputsGroup() {
        return this.#inputsGroup;
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

    get settingsContainer() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.container);
    }

    get settingsPanel() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.settingsPanel);
    }

    get settingsBtn() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.settingsBtn);
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
        const savedSettings = LocalStorageHelper.appSettings;
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
        this.inputsGroup.controllers = new Switcher(params, this.onDarkThemeChange.bind(this));
    }

    initMineTypeController() {
        const params = this.getThemeTypeControllerParams(SettingType.MineType);
        params.options = SettingsOptionsHelper.getMineTypeOptions();
        this.inputsGroup.controllers = new DropdownSelect(params, this.onDropdownChange.bind(this), this.onDropdownExpanded.bind(this));
    }

    initColorController(settingName, settingToCheckName) {
        const params = this.getThemeTypeControllerParams(settingName);
        params.options = SettingsOptionsHelper.getAllowedColorOptions(this.settings[settingToCheckName]);
        this.inputsGroup.controllers = new DropdownSelect(params, this.onDropdownChange.bind(this), this.onDropdownExpanded.bind(this));
    }

    renderSetting(key) {
        const settingsSection = SettingsViewHelper.generateSettingSection(key);
        settingsSection.append(this.inputsGroup.getController(key).generateInputField());
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
        this.detectOusideClick();
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

    detectOusideClick() {
        document.addEventListener("click", this.collapseOnOutsideClick.bind(this));
    }

    collapseOnOutsideClick(event) {
        const settingsPanel = event.target.closest(`.${DOM_ELEMENT_CLASS.settingsPanel}`);
        const toggleBtn = event.target.closest(`#${DOM_ELEMENT_ID.settingsBtn}`);
        if (!toggleBtn && !settingsPanel && this.expanded) {
            this.expanded = false;
            this.collapseSettings();
        }
        document.removeEventListener("click", this.collapseOnOutsideClick.bind(this));
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
        toCollapse.forEach(type => this.inputsGroup.getController(type).collapseDropdown());
    }

    onDarkThemeChange(params) {
        const selectedTheme = params.value ? Theme.Dark : Theme.Default;
        this.settings.theme = selectedTheme;
        this.saveSettings();
        this.setAppTheme();
    }

    saveSettings() {
        LocalStorageHelper.appSettings = clone(this.settings);
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
        this.inputsGroup.getController(fieldToUpdate).updateOptions(newOptions);
    }

}
