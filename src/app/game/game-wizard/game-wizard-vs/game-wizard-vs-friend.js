"use strict";

import { GameType } from "Game";

import { GameWizardVS } from "./_game-wizard-vs";
import { TITLE } from "../game-wizard.constants";
import { WIZARD_NAME, LevelWizard, OptionsWizard, VSModeWizard, TurnSettingsWizard } from "../../game-settings-wizard/@game-settings-wizard.module";
import { Game, Player, BotPlayer } from "Game";

export class GameWizardVSFriend extends GameWizardVS {

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    this.opponent = new Player("testId", "sdfasdfasdfasdfasdfsdfasdfasdfasdfasdfsdfasdfasdfasdfasdf");
    this.init();
  }

  get parallelAllowed() {
    return false;
  }

}
