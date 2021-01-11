"use strict";

import { GameType } from "GameEnums";
import { Player } from "GameModels";
import { GameSetupVS } from "./_game-setup-vs";
export class GameSetupOnline extends GameSetupVS {
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
