"use strict";

import { ElementHandler } from "../../utilities/element-handler";
import { ElementGenerator } from "../../utilities/element-generator";

import { DOM_ELEMENT_CLASS, CONTENT } from "./settings-controller.constants";

export class SettingsViewHelper {

	static generateSettingSection(key) {
		const settingsSection = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.settingsSection]);
		const settingTag = this.generateSettingTag(key);
		settingsSection.append(settingTag);
		return settingsSection;
	}

	static generateSettingTag(settingKey) {
		const settingTag = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.settingsTag]);
		settingTag.innerHTML = CONTENT[settingKey];
		return settingTag;
	}

	static generateGameSettingSection(key) {
		const settingsSection = this.generateSettingSection(key);
		ElementHandler.addStyleClass(settingsSection, DOM_ELEMENT_CLASS.gameSettings);
		return settingsSection;
	}

}
