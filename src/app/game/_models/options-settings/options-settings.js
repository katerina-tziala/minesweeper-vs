"use strict";
import { valueDefined } from "~/_utils/validator";
import { AppModel } from "~/_models/app-model";
import { GameVSMode } from "GameEnums";
import { SneakPeekSettings } from "../sneak-peek-settings/sneak-peek-settings";
export class OptionsSettings extends AppModel {
  constructor(vsMode) {
    super();
    this.marks = false;
    this.wrongFlagHint = false;
    this.tileFlagging = true;
    this.tileRevealing = true;
    this.sneakPeekSettings = undefined;
    this.propertiesVS = vsMode;
  }

  set propertiesVS(vsMode) {
    this.vsMode = vsMode ? vsMode : null;
    this.setModePropertiesVS();
  }

  get strategy() {
    return this.tileFlagging;
  }

  get sneakPeekDisabled() {
    if (!this.strategy) {
      return true;
    }

    if (valueDefined(this.openStrategy)) {
      return this.openStrategy;
    }

    if (valueDefined(this.openCompetition)) {
      return this.openCompetition;
    }

    return false;
  }

  initOptionsBasedOnTileFlagging() {
    if (!this.tileFlagging) {
      this.marks = false;
      this.wrongFlagHint = false;
      this.tileRevealing = true;
      this.unlimitedFlags = true;
      this.openStrategy = true;
      this.#setDefaultSneakPeekOptions();
    }
  }

  setModePropertiesVS() {
    switch (this.vsMode) {
      case GameVSMode.Clear:
        this.unlimitedFlags = true;
        this.openStrategy = true;
        this.#setDefaultSneakPeekOptions();
        break;
      case GameVSMode.Detect:
        this.unlimitedFlags = true;
        this.sneakPeekSettings = undefined;
        break;
      case GameVSMode.Parallel:
        this.identicalMines = true;
        this.openCompetition = true;
        this.#setDefaultSneakPeekOptions();
        break;
    }
  }

  update(updateData) {
    super.update(updateData);
    if (updateData && this.vsMode && this.vsMode !== GameVSMode.Detect) {
      this.updateSneakPeeks(updateData);
    } else {
      this.sneakPeekSettings = undefined;
    }
  }

  updateSneakPeeks(updateData) {
    this.sneakPeekSettings = new SneakPeekSettings();
    if (updateData.sneakPeekSettings) {
      this.sneakPeekSettings.update(updateData.sneakPeekSettings);
    }
    if (this.sneakPeekDisabled) {
      this.sneakPeekSettings.applied = false;
      this.sneakPeekSettings.updateBasedOnApplied();
    }
  }

  #setDefaultSneakPeekOptions() {
    this.sneakPeekSettings = new SneakPeekSettings();
  }

}
