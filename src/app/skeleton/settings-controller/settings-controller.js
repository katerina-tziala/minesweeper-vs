"use strict";

import { TYPOGRAPHY } from "../../utilities/constants/typography.constants";
import { SETTINGS_BTN } from "../../utilities/constants/btn-icon.constants";
import { ElementHandler } from "../../utilities/element-handler";
import { ElementGenerator } from "../../utilities/element-generator";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT } from "./settings-controller.constants";
import { MINETYPE, THEME } from "../../utilities/enums/app-settings.enums";
import { Form } from "../../components/form/form";

import { Switcher } from "../../components/user-input/switcher/switcher";

import { Dropdown } from "../../components/user-input/dropdown/dropdown";
import { LocalStorageHelper } from "../../utilities/local-storage-helper";
import { clone } from "../../utilities/utils";
import { DOM_ELEMENT_ID as APP_ELEMENTS_IDS, DOM_ELEMENT_CLASS as APP_STYLE_CLASS } from "../../utilities/constants/ui.constants";
export class SettingsController {
	#settings;

	constructor(settings) {
		this.settings = settings;
		this.saveSettings();
		this.setAppTheme();
		this.themeSwitcher = new Switcher("theme", this.settings.theme === THEME.Dark, this.onDarkThemeChange.bind(this));
	
		this.initMineTypeController();
		this.initView();
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

	initMineTypeController() {
		const options = {
			name: "mineType",
			value: this.settings.mineType,
			selectLabel: CONTENT.mineType,
			options: this.getMineTypeOptions(),
		};
		this.mineTypeController = new Dropdown(options, this.onMineTypeChange.bind(this));
	}

	getMineTypeOptions() {
		const options = [];
		Object.values(MINETYPE).forEach(type => {
			options.push({
				value: type,
				label: `<div class="mine-type-option mine-type-option--${type}"></div>`
			});
		});
		return options;
	}

	renderSettingsOptions(settingsPanel) {
		settingsPanel.append(this.renderThemeOption());
		settingsPanel.append(this.renderMineTypeOption());
	}

	renderThemeOption() {
		const settingsSection = this.generateSettingSection("theme");
		settingsSection.append(this.themeSwitcher.generateInput());
		return settingsSection;
	}

	renderMineTypeOption() {
		const settingsSection = this.generateSettingSection("mineType");
		ElementHandler.addStyleClass(settingsSection, DOM_ELEMENT_CLASS.gameSettings);


		settingsSection.append(this.mineTypeController.generateInput());

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
