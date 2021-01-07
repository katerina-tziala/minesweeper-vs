"use strict";

import { AppModel } from "~/_models/app-model";
import { GameVSMode } from "GameEnums";

export class OptionsSettings extends AppModel {
  constructor(vsMode) {
    super();
    this.marks = false;
    this.wrongFlagHint = false;
    this.tileFlagging = true;
    this.tileRevealing = true;
    this.propertiesVS = vsMode;
  }

  set propertiesVS(vsMode) {
    this.vsMode = vsMode ? vsMode : null;
    this.setModePropertiesVS();
  }

  initOptionsBasedOnTileFlagging() {
    if (!this.tileFlagging) {
      this.marks = false;
      this.wrongFlagHint = false;
      this.tileRevealing = true;
      this.unlimitedFlags = true;
      this.openStrategy = true;
      this.setDefaultSneakPeekOptions();
    }
  }

  setModePropertiesVS() {
    switch (this.vsMode) {
      case GameVSMode.Clear:
        this.unlimitedFlags = true;
        this.openStrategy = true;
        this.setDefaultSneakPeekOptions();
        break;
      case GameVSMode.Detect:
        this.unlimitedFlags = true;
        break;
      case GameVSMode.Parallel:
        this.identicalMines = true;
        this.openCompetition = true;
        this.setDefaultSneakPeekOptions();
        break;
    }
  }

  setDefaultSneakPeekOptions() {
    this.sneakPeek = false;
    this.sneakPeekDuration = 0;
    this.sneakPeeksLimit = 0;
  }

}
