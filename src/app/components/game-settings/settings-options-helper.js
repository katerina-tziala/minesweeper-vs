"use strict";

import { COLOR_TYPES } from "~/_constants/ui.constants";
import { MineType } from "~/_enums/app-settings.enums";

export class GameOptionsHelper {

  static getMineTypeOptions() {
    return Object.values(MineType).map(type => {
      return {
        value: type,
        innerHTML: `<div class="mine-type-option mine-type-option--${type}"></div>`,
      };
    });
  }

  static getAllowedColorOptions(colorToExclude) {
    const colors = COLOR_TYPES.filter((color) => color !== colorToExclude);
    return colors.map(color => {
      return {
        value: color,
        innerHTML: `<div class="game-color-option color-type--${color}"></div>`,
      };
    });
  }

}
