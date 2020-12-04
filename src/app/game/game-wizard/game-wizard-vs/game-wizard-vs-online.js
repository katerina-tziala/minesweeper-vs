"use strict";

import { GameType } from "Game";
import { GameWizardVS } from "./_game-wizard-vs";
import { Player } from "Game";
import { EndButtonType } from "../game-wizard-stepper/@game-wizard-stepper.module";

export class GameWizardVSOnline extends GameWizardVS {

  constructor(onClose, submitGame, clientToInvite) {
    super(onClose, submitGame);
    this.opponent = new Player(clientToInvite.id, clientToInvite.username);
    this.init();
  }

  // OVERIDDEN FUNCTIONS
  get gameType() {
    return GameType.Online;
  }

  get stepperSubmissionType() {
    return EndButtonType.invite;
  }

}
