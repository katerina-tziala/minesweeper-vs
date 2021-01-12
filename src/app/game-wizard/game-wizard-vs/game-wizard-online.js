"use strict";

import { GameType } from "GameEnums";
import { Player } from "GameModels";
import { GameWizardVS } from "./_game-wizard-vs";
export class GameWizardOnline extends GameWizardVS {
  constructor(onClose, submitGame, clientToInvite) {
    super(onClose, submitGame);
    this.init(clientToInvite);
  }

  get invite() {
    return true;
  }

  get gameType() {
    return GameType.Online;
  }

  init(clientToInvite) {
    if (clientToInvite) {
      this.opponent = new Player(clientToInvite.id, clientToInvite.username, false);
    }
    super.init();
  }
  
}
