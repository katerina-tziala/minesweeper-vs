"use strict";
import { GameType } from "Game";
import { GameWizardVS } from "./_game-wizard-vs";
import { TITLE } from "../game-wizard.constants";
import { WIZARD_NAME } from "../../game-settings-wizard/@game-settings-wizard.module";
import { BotPlayer } from "Game";
export class GameWizardVSBot extends GameWizardVS {

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.opponent = new BotPlayer();
    this.init();
  }

  get gameType() {
    return GameType.Bot;
  }

  get title() {
    return TITLE[this.gameType];
  }

  generateContent() {
    const fragment = super.generateContent();
    if (this.wizardStepName === WIZARD_NAME.vsModeSettings) {
      console.log("add vs bot difficulty");
    }
    return fragment;
  }

}
