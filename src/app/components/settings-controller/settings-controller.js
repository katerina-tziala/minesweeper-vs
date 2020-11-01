"use strict";

import { DOM_ELEMENT_ID as APP_ELEMENTS_IDS, DOM_ELEMENT_CLASS as APP_STYLE_CLASS } from "../../utilities/constants/ui.constants";
import { THEME } from "../../utilities/enums/app-settings.enums";
import { SETTINGS_BTN } from "../../utilities/constants/btn-icon.constants";
import { ElementHandler } from "../../utilities/element-handler";
import { ElementGenerator } from "../../utilities/element-generator";
import { AriaHandler } from "../../utilities/aria-handler";
import { LocalStorageHelper } from "../../utilities/local-storage-helper";
import { clone } from "../../utilities/utils";

import { Switcher } from "../../components/user-input/switcher/switcher";
import { DropdownSelect } from "../../components/user-input/dropdown-select/dropdown-select";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, DROPDOWNS } from "./settings-controller.constants";
import { SettingsOptionsHelper } from "./settings-options-helper";
import { SettingsViewHelper } from "./settings-view-helper";

export class SettingsController {
	#inputControllers;
	#settings;
	#gameSettingsHidden;
	#expanded;

	constructor(settings, gameSettingsHidden = true) {
		this.settings = settings;
		this.saveSettings();
		this.setAppTheme();
		this.#inputControllers = {};
		this.gameSettingsHidden = gameSettingsHidden;
		this.expanded = false;
		this.initThemeTypeController();
		this.initMineTypeController();
		this.initPlayerColorController();
		this.initOpponentColorController();
		this.initView();
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

	initView() {
		this.settingsContainer.then(container => {
			const settingsBtn = ElementGenerator.generateButton(SETTINGS_BTN, this.toggleSettingsDisplay.bind(this));
			const settingsPanel = ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.settingsPanel);
			ElementHandler.setID(settingsPanel, DOM_ELEMENT_ID.settingsPanel);
			this.renderSettingsOptions(settingsPanel);
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
		const params = this.getThemeTypeControllerParams("theme");
		params.value = this.settings.theme === THEME.Dark;
		this.inputControllers = new Switcher(params, this.onDarkThemeChange.bind(this));
	}

	initMineTypeController() {
		const params = this.getThemeTypeControllerParams("mineType");
		params.options = SettingsOptionsHelper.getMineTypeOptions();
		this.inputControllers = new DropdownSelect(params, this.onDropdownChange.bind(this), this.onDropdownExpanded.bind(this));
	}

	initPlayerColorController() {
		const params = this.getThemeTypeControllerParams("playerColorType");
		params.options = SettingsOptionsHelper.getAllowedColorOptions(this.settings.opponentColorType);
		this.inputControllers = new DropdownSelect(params, this.onDropdownChange.bind(this), this.onDropdownExpanded.bind(this));
	}

	initOpponentColorController() {
		const params = this.getThemeTypeControllerParams("opponentColorType");
		params.options = SettingsOptionsHelper.getAllowedColorOptions(this.settings.playerColorType);
		this.inputControllers = new DropdownSelect(params, this.onDropdownChange.bind(this), this.onDropdownExpanded.bind(this));
	}

	renderSettingsOptions(settingsPanel) {
		settingsPanel.append(this.renderThemeOption());
		DROPDOWNS.forEach(type => settingsPanel.append(this.renderDropdownSetting(type)));
	}

	renderThemeOption() {
		const settingsSection = SettingsViewHelper.generateSettingSection("theme");
		settingsSection.append(this.getInputController("theme").generateInputField());
		return settingsSection;
	}

	renderDropdownSetting(key) {
		const settingsSection = SettingsViewHelper.generateSettingSection(key);
		settingsSection.append(this.getInputController(key).generateInputField());
		return settingsSection;
	}

	toggleSettingsDisplay() {
		this.expanded = !this.expanded;
		this.expanded ? this.expandSettings() : this.collapseSettings();
	}

	expandSettings() {
		let height = 10;
		this.settingsPanel.then(panel => {
			const settingsSections = panel.childNodes;
			height += settingsSections[0].getBoundingClientRect().height;
			for (let index = 1; index < settingsSections.length; index++) {
				const settingsSection = settingsSections[index];
				if (this.gameSettingsHidden) {
					ElementHandler.hide(settingsSection);
				} else {
					ElementHandler.display(settingsSection);
					height += settingsSection.getBoundingClientRect().height;
				}
				panel.style.height = `${height}px`;
			}
		});
		this.setSettingsButtonState();
	}

	collapseSettings() {
		this.settingsPanel.then(panel => panel.style.height = "0px");
		this.setSettingsButtonState();
	}

	setSettingsButtonState() {
		this.settingsBtn.then(btn => AriaHandler.setAriaExpanded(btn, this.expanded));
	}

	onDropdownExpanded(expandedName) {
		const toCollapse = DROPDOWNS.filter(type => type !== expandedName);
		toCollapse.forEach(type => this.getInputController(type).collapseDropdown());
	}

	onDarkThemeChange(params) {
		const selectedTheme = params.value ? THEME.Dark : THEME.Default;
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
		if (params.name === "playerColorType") {
			this.updateColorDropdown("playerColorType", "opponentColorType");
		} else if (params.name === "opponentColorType") {
			this.updateColorDropdown("opponentColorType", "playerColorType");
		}
		this.saveSettings();
	}

	updateColorDropdown(changedField, fieldToUpdate) {
		const newOptions = SettingsOptionsHelper.getAllowedColorOptions(this.settings[changedField]);
		this.getInputController(fieldToUpdate).updateOptions(newOptions);
	}

}
