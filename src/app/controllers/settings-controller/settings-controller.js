"use strict";

import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";

import { SettingsItem } from "./settings-item";

import { setAppTheme } from "../../_utils/theming";


import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  SETTINGS_KEYS,
  CONTENT
} from "./settings-controller.constants";
import {
  Toggle
} from "../../components/toggle/toggle";

import {
  User
} from "../../_models/user";
import { AppSettingsModel } from "~/_models/app-settings";
import {
  UserInputsGroupController,
  DropdownSelect,
  Switcher,
} from "UserInputs";
import { Theme } from "~/_enums/app-settings.enums";

export class SettingsController {

  #settings;
  #toggle;
  #inputsGroup;
  #themeSwitcher;

  constructor() {
    console.log("SettingsController");
    this.#settings = new AppSettingsModel();
    this.#toggle = new Toggle("settings");
    this.#inputsGroup = new UserInputsGroupController();
 


    this.#initThemeController();
  }

  #initThemeController() {
    const params = {
      name: SETTINGS_KEYS.theme,
      value: this.#settings.theme === Theme.Dark,
    };
    this.#themeSwitcher = new Switcher(params, this.#onDarkThemeChange.bind(this));
  }

  get #generatedThemeSection() {
    return SettingsItem.generateItem(this.#themeSwitcher);
  }




  generateView() {

    //console.log(this.#settings);
    
    return this.#toggle.generateView(this.#generateToggleContent());
  }


  #generateToggleContent() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.#generatedThemeSection);

    return fragment;
  }


  



  #onDarkThemeChange(params) {
    const selectedTheme = params.value ? Theme.Dark : Theme.Default;
    this.#settings.theme = selectedTheme;
    this.#settings.saveLocally();
    setAppTheme();
  }

}
