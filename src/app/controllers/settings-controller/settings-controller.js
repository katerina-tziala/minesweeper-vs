"use strict";
import { setAppTheme } from "../../_utils/theming";
import {
  ElementHandler,
  ElementGenerator
} from "HTML_DOM_Manager";
import { Switcher } from "UserInputs";
import { AppSettingsModel } from "~/_models/app-settings";
import { Theme } from "~/_enums/app-settings.enums";
import { DOM_ELEMENT_ID } from "./settings-controller.constants";
import { SettingsItem } from "../../components/settings-item/settings-item";
import { Toggle } from "../../components/toggle/toggle";
import { GameSettings } from "../../components/game-settings/game-settings";

export class SettingsController {
  #settings;
  #Toggle;
  #ThemeSwitcher;
  #GameSettings;
  #gameSettingsAllowed;

  constructor(gameSettingsAllowed = false) {
    this.#gameSettingsAllowed = gameSettingsAllowed;
    this.#settings = new AppSettingsModel();
    this.#Toggle = new Toggle("settings", false, true);
    this.#initThemeController();
    this.#initGameSettings();
  }

  #initThemeController() {
    const params = {
      name: "theme",
      value: this.#settings.theme === Theme.Dark,
    };
    this.#ThemeSwitcher = new Switcher(params, this.#onDarkThemeChange.bind(this));
  }

  get #generatedThemeSection() {
    return SettingsItem.generateItem(this.#ThemeSwitcher);
  }

  get #container() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container);
  }

  #initGameSettings() {
    this.#GameSettings = this.#gameSettingsAllowed ? new GameSettings(this.#settings) : undefined;
  }

  #generateToggleContent() {
    const container = ElementGenerator.generateContainer([], DOM_ELEMENT_ID.container);
    container.append(this.#generatedThemeSection);
    if (this.#GameSettings) {
      container.append(this.#GameSettings.generateView());
    }
    return container;
  }

  #onDarkThemeChange(params) {
    const selectedTheme = params.value ? Theme.Dark : Theme.Default;
    this.#settings.theme = selectedTheme;
    this.#settings.saveLocally();
    setAppTheme();
  }

  generateView() {
    return this.#Toggle.generateView(this.#generateToggleContent());
  }

  #removeGameSettings() {
    if (!this.#GameSettings) {
      return new Promise.resolve();
    }
    return this.#GameSettings.onDestroy().then(() => {
      this.#GameSettings = undefined;
      return;
    });
  }

  #addGameSettings() {
    this.#initGameSettings();
    return this.#container.then(container => {
      container.append(this.#GameSettings.generateView());
      return;
    });
  }

  toggleGameSettingsDisplay(gameSettingsAllowed) {
    this.#gameSettingsAllowed = gameSettingsAllowed;
    if (!this.#gameSettingsAllowed) {
      return this.#removeGameSettings();
    }
    return this.#addGameSettings();
  }

}
