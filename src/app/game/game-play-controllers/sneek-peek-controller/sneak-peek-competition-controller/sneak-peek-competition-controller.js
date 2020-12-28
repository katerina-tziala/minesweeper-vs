"use strict";
import { SneakPeekController } from "../sneak-peek-controller";
export class SneakPeekCompetitionController extends SneakPeekController {

  constructor(onSneakPeek, onSneakPeekEnd, allowedByStrategy) {
    super(onSneakPeek, onSneakPeekEnd, allowedByStrategy, false);
  }

  get sneakPeekAllowed() {
    if (!this.allowed || !this.player) {
      return false;
    }

    return this.sneakPeekAllowedForPlayer;
  }

  setControllerPlayer(player) {
    this.player = player;
    return this.updateToggleState();
  }

  updateToggleState() {
    return this.updatePeekToggle(!this.sneakPeekAllowed, this.player.colorType, this.playerSneakPeeksLimit);
  }

  stopPeeking() {
    return this.stopPeekingCountDown().then(() => this.updateToggleState());
  }

}
