"use strict";

import { AppModel } from "./app-model";

import { Theme, MineType } from "../_enums/app-settings.enums";
import { randomValueFromArray } from "~/_utils/utils";
import { COLOR_TYPES } from "~/_constants/ui.constants";
export class AppSettingsModel extends AppModel {
  constructor() {
    super();
    this.theme = Theme.Default;
    this.mineType = randomValueFromArray(Object.values(MineType));
    this.playerColorType = this.generateColorType(this.opponentColorType);
    this.opponentColorType = this.generateColorType(this.playerColorType);
  }

  generateColorType(typeToExclude) {
    let types = COLOR_TYPES.filter((type) => type !== typeToExclude);
    return randomValueFromArray(types);
  }
}
