"use strict";

import { ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS, CONTENT } from "./settings-item.constants";

export class SettingsItem {

  static generateItem(inputController) {
    const settingsItem = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.settingsItem]);
    const settingTag = this.generateSettingTag(inputController.name);
    
    settingsItem.append(settingTag, inputController.generateInputField());
    return settingsItem;
  }

  static generateSettingTag(settingKey) {
    const settingTag = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.settingsTag]);
    settingTag.innerHTML = CONTENT[settingKey];
    return settingTag;
  }

}
