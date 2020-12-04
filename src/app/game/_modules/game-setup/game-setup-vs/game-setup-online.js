"use strict";

import { GameType } from "GameEnums";
import { Player } from "GameModels";

import { GameSetupVS } from "./_game-setup-vs";
import { EndButtonType } from "GameWizardStepper";
export class GameSetupOnline extends GameSetupVS {

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
