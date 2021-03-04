"use strict";
import { AppSettingsModel } from "~/_models/app-settings";
import { Theme } from "~/_enums/app-settings.enums";
import { Toggle } from "~/components/toggle/toggle";
import { Switcher } from "UserInputs";
import { GameSettings } from "~/components/game-settings/game-settings";
import { SettingsControllerViewHelper as ViewHelper } from "./settings-controller-view-helper/settings-controller-view-helper";

export class SettingsController {
  #settings;
  #Toggle;
  #ThemeSwitcher;
  #GameSettings;
  #gameSettingsAllowed;

  constructor(gameSettingsAllowed = false) {
    this.#gameSettingsAllowed = gameSettingsAllowed;
    this.#init();
  }

  #initAppSettings() {
    this.#settings = new AppSettingsModel();
    this.#settings.saveLocally();
  }

  #setAppTheme() {
    return ViewHelper.setAppTheme(this.#settings);
  }

  #initThemeController() {
    const params = {
      name: "theme",
      value: this.#settings.theme === Theme.Dark,
    };
    this.#ThemeSwitcher = new Switcher(params, this.#onThemeChange.bind(this));
  }

  #initGameSettings() {
    this.#GameSettings = this.#gameSettingsAllowed ? new GameSettings(this.#settings) : undefined;
  }

  #init() {
    this.#initAppSettings();
    this.#Toggle = new Toggle("settings", false, true);
    this.#initThemeController();
    this.#initGameSettings();
    this.#setAppTheme().then(() => {
      this.#initView();
    });
  }

  #initView() {
    ViewHelper.getContainer().then(container => {
      const toggleContent = ViewHelper.generateToggleContainer(this.#ThemeSwitcher, this.#GameSettings);
      const toggle = this.#Toggle.generateView(toggleContent);  
      container.append(toggle);
    });
  }

  #onThemeChange(params) {
    const selectedTheme = params.value ? Theme.Dark : Theme.Default;
    this.#settings.theme = selectedTheme;
    this.#settings.saveLocally();
    this.#setAppTheme();
  }

  #removeGameSettings() {
    if (!this.#GameSettings) {
      return;
    }

    this.#GameSettings.onDestroy().then(() => {
      this.#GameSettings = undefined;
    });
  }

  #addGameSettings() {
    if (!this.#GameSettings) {
      return;
    }
    
    ViewHelper.getContentContainer().then(container => {
      container.append(this.#GameSettings.generateView());
    });
  }

  setGameSettingsDisplay(gameSettingsAllowed) {
    if (this.#gameSettingsAllowed === gameSettingsAllowed) {
      return;
    }

    this.#gameSettingsAllowed = gameSettingsAllowed;
    this.#initGameSettings();
    this.#Toggle.collapse().then(() => {
      this.#gameSettingsAllowed ? this.#addGameSettings() : this.#removeGameSettings();
    });
  }

}
