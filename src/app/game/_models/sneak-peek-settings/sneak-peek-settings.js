"use strict";
import { sortNumbersArrayAsc } from "~/_utils/utils";
import { AppModel } from "~/_models/app-model";
import { GameLevel } from "GameEnums";
import { LEVEL_PARAMS } from "./sneak-peek-settings.constants";

export class SneakPeekSettings extends AppModel {

  constructor() {
    super();
    this.allowed = false;
    this.duration = null;
    this.limit = null;
  }

}
