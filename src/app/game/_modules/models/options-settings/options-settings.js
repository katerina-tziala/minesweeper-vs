"use strict";

import { AppModel } from "~/_models/app-model";
import { GameVSMode } from "GameEnums";

export class OptionsSettings extends AppModel {

  constructor(vsMode) {
    super();
    this.marks = false;
    this.wrongFlagHint = false;
    this.propertiesVS = vsMode;
  }

  set propertiesVS(vsMode) {
    this.vsMode = vsMode ? vsMode : null;
    if (vsMode) {
      this.setModePropertiesVS();
    }
  }

  setModePropertiesVS() {
    switch (this.vsMode) {
      case GameVSMode.Clear:
        this.unlimitedFlags = true;
        this.openStrategy = false;
        this.sneakPeek = false;
        this.sneakPeekDuration = 0;
        break;
      case GameVSMode.Detect:
        this.unlimitedFlags = true;
        this.tileRevealing = true;
        break;
      case GameVSMode.Parallel:
        this.sameMinePositions = true;
        this.openStrategy = false;
        this.sneakPeek = false;
        this.sneakPeekDuration = 0;
        break;
    }
  }

}
