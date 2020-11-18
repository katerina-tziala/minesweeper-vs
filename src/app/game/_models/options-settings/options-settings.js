"use strict";

import { AppModel } from "~/_models/app-model";
import { GameVSMode } from "../../_enums/game-vs-mode.enum";

export class OptionsSettings extends AppModel {

  constructor(vsMode) {
    super();
    this.marks = false;
    this.wrongFlagHint = false;
    this.propertiesVS = vsMode;
  }

  set propertiesVS(vsMode) {
    this.vsMode = vsMode ? vsMode : null;
    if (vsMode && vsMode === GameVSMode.Clear) {
      this.unlimitedFlags = true;
      this.openStrategy = false;
      this.sneakPeek = false;
      this.sneakPeekDuration = 0;
    }
    if (vsMode && vsMode === GameVSMode.Detect) {
      this.unlimitedFlags = true;
      this.tileRevealing = true;
    }
  }

}
