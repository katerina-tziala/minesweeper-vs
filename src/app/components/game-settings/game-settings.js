"use strict";
import { COLOR_TYPES } from "~/_constants/ui.constants";
import { MineType } from "~/_enums/app-settings.enums";
import { ElementGenerator } from "HTML_DOM_Manager";
import {
  UserInputsGroupController,
  DropdownSelect,
} from "UserInputs";
import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  GAME_SETTINGS_KEYS,
} from "./game-settings.constants";
import { SettingsItem } from "~/components/settings-item/settings-item";

export class GameSettings {
  #settings;
  #MineTypeController;
  #ColorsControllers;

  constructor(settings) {
    this.#ColorsControllers = new UserInputsGroupController();
    this.#settings = settings;
  }

  get #mineTypeOptions() {
    return Object.values(MineType).map(type => {
      return {
        value: type,
        innerHTML: `<div class="mine-type-option mine-type-option--${type}"></div>`,
      };
    });
  }

  #colorOptions(colorToExclude) {
    const colors = COLOR_TYPES.filter((color) => color !== colorToExclude);
    return colors.map(color => {
      return {
        value: color,
        innerHTML: `<div class="game-color-option color-type--${color}"></div>`,
      };
    });
  }

  #getControllerParams(type) {
    return {
      name: type,
      value: this.#settings[type],
    };
  }

  #initControllers() {
    this.#initMineTypeController();
    this.#ColorsControllers.controllers = this.#generateColorTypeDropDown(GAME_SETTINGS_KEYS.playerColorType, GAME_SETTINGS_KEYS.opponentColorType);
    this.#ColorsControllers.controllers = this.#generateColorTypeDropDown(GAME_SETTINGS_KEYS.opponentColorType, GAME_SETTINGS_KEYS.playerColorType);
  }

  #initMineTypeController() {
    const params = this.#getControllerParams(GAME_SETTINGS_KEYS.mineType);
    params.options = this.#mineTypeOptions;
    this.#MineTypeController = new DropdownSelect(params, this.#updateAndSaveSettings.bind(this));
  }

  #updateAndSaveSettings(params) {
    this.#settings[params.name] = params.value;
    this.#settings.saveLocally();
  }

  #generateColorTypeDropDown(fieldName, dependendFieldName) {
    const params = this.#getControllerParams(fieldName);
    params.options = this.#colorOptions(this.#settings[dependendFieldName]);
    return new DropdownSelect(params, (params) => this.#onColorTypeChange(params, dependendFieldName));
  }

  #onColorTypeChange(params, dependendFieldName) {
    this.#updateAndSaveSettings(params);
    const newOptions = this.#colorOptions(this.#settings[params.name]);
    this.#ColorsControllers.getController(dependendFieldName).updateOptions(newOptions);
  }

  generateView() {
    this.#initControllers();
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_ID.container);
    container.append(SettingsItem.generateItem(this.#MineTypeController));
    this.#ColorsControllers.controllers.forEach(controller => {
      container.append(SettingsItem.generateItem(controller));
    });
    return container;
  }

  destroy() {
    console.log("destroy");
  }
}
