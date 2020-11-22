"use strict";

import { GameType } from "Game";

import { GameWizardVS } from "./_game-wizard-vs";
import { TITLE } from "../game-wizard.constants";
import { WIZARD_NAME, LevelWizard, OptionsWizard, VSModeWizard, TurnSettingsWizard } from "../../game-settings-wizard/@game-settings-wizard.module";
import { Game, Player, BotPlayer } from "Game";

import { GameWizardStepper } from "../game-wizard-stepper/game-wizard-stepper";

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



  // generateContent() {
  //   const fragment = document.createDocumentFragment();
  //   return fragment;
  // }
}
