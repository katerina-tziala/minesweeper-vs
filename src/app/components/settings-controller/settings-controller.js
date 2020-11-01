"use strict";

import { TYPOGRAPHY } from "../../utilities/constants/typography.constants";
import { SETTINGS_BTN } from "../../utilities/constants/btn-icon.constants";
import { ElementHandler } from "../../utilities/element-handler";
import { ElementGenerator } from "../../utilities/element-generator";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, DROPDOWNS } from "./settings-controller.constants";
import { MINETYPE, THEME } from "../../utilities/enums/app-settings.enums";
import { Form } from "../../components/form/form";

import { Switcher } from "../../components/user-input/switcher/switcher";

import { DropdownSelect } from "../../components/user-input/dropdown-select/dropdown-select";
import { LocalStorageHelper } from "../../utilities/local-storage-helper";
import { clone } from "../../utilities/utils";
import { DOM_ELEMENT_ID as APP_ELEMENTS_IDS, DOM_ELEMENT_CLASS as APP_STYLE_CLASS } from "../../utilities/constants/ui.constants";

import { SettingsOptionsHelper } from "./settings-options-helper";






export class SettingsController {
	#inputControllers;
	#settings;

	constructor(settings) {
		this.settings = settings;
		this.saveSettings();
		this.setAppTheme();
		this.#inputControllers = {};
		this.initThemeTypeController();
		this.initMineTypeController();
		this.initPlayerColorController();
		this.initOpponentColorController();
		this.initView();
	}

	set inputControllers(controller) {
		delete this.#inputControllers[controller.name];
		this.#inputControllers[controller.name] = controller;
	}

	get inputControllers() {
		return Object.values(this.#inputControllers);
	}

	getInputController(key) {
		return this.#inputControllers[key];
	}

	get settings() {
		return this.#settings;
	}

	set settings(settings) {
		this.#settings = settings;
	}

	get settingsContainer() {
		return ElementHandler.getByID(DOM_ELEMENT_ID.container);
	}

	get settingsPanel() {
		return ElementHandler.getByID(DOM_ELEMENT_ID.settingsPanel);
	}

	initView() {
		this.settingsContainer.then(container => {
			const settingsBtn = ElementGenerator.generateButton(SETTINGS_BTN, this.toggleSettingsDisplay.bind(this));
			const settingsPanel = ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.settingsPanel);
			ElementHandler.setID(settingsPanel, DOM_ELEMENT_ID.settingsPanel);
			this.renderSettingsOptions(settingsPanel);
			container.append(settingsBtn, settingsPanel);
		}, 1000);
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
		params.options = this.getMineTypeOptions();
		this.inputControllers = new DropdownSelect(params, this.onMineTypeChange.bind(this), this.onDropdownExpanded.bind(this));
	}

	initPlayerColorController() {
		const params = this.getThemeTypeControllerParams("playerColorType");
		const options = SettingsOptionsHelper.getAllowedColorOptions(this.settings.opponentColorType);
		params.options = options;
		this.inputControllers = new DropdownSelect(params, this.onMineTypeChange.bind(this), this.onDropdownExpanded.bind(this));
	}

	initOpponentColorController() {
		const params = this.getThemeTypeControllerParams("opponentColorType");
		const options = SettingsOptionsHelper.getAllowedColorOptions(this.settings.playerColorType);
		params.options = options;
		this.inputControllers = new DropdownSelect(params, this.onMineTypeChange.bind(this), this.onDropdownExpanded.bind(this));
	}



	getMineTypeOptions() {
		const options = [];
		Object.values(MINETYPE).forEach(type => {
			options.push({
				value: type,
				innerHTML: `<div class="mine-type-option mine-type-option--${type}"></div>`
			});
		});
		return options;
	}

	renderSettingsOptions(settingsPanel) {
		settingsPanel.append(this.renderThemeOption());
		settingsPanel.append(this.renderMineTypeOption());
		settingsPanel.append(this.renderColorOptions("playerColorType"));
		settingsPanel.append(this.renderColorOptions("opponentColorType"));
	}

	renderThemeOption() {
		const settingsSection = this.generateSettingSection("theme");
		console.log(this.getInputController("theme"));
		settingsSection.append(this.getInputController("theme").generateInputField());
		return settingsSection;
	}

	renderMineTypeOption() {
		const settingsSection = this.generateSettingSection("mineType");
		ElementHandler.addStyleClass(settingsSection, DOM_ELEMENT_CLASS.gameSettings);
		settingsSection.append(this.getInputController("mineType").generateInputField());
		return settingsSection;
	}
	renderColorOptions(key) {
		const settingsSection = this.generateSettingSection(key);
		ElementHandler.addStyleClass(settingsSection, DOM_ELEMENT_CLASS.gameSettings);
		settingsSection.append(this.getInputController(key).generateInputField());
		return settingsSection;
	}


	generateSettingSection(key) {
		const settingsSection = ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.settingsSection);
		const settingTag = this.generateSettingTag(key);
		settingsSection.append(settingTag);
		return settingsSection;
	}

	generateSettingTag(settingKey) {
		const settingTag = ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.settingsTag);
		settingTag.innerHTML = CONTENT[settingKey];
		return settingTag;
	}

	toggleSettingsDisplay() {
		console.log("toggleSettingsDisplay");
	}



	onDropdownExpanded(expandedName) {
		const toCollapse = DROPDOWNS.filter(type => type !== expandedName);
	//	toCollapse.forEach(type => this.getInputController(type).collapseDropdown());

		console.log(expandedName);
		//DROPDOWNS
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


	onMineTypeChange(params) {
		console.log(params);
	}

}
