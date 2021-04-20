"use strict";
import { SneakPeekController } from "../_sneak-peek-controller";
export class SneakPeekCompetitionController extends SneakPeekController {

  constructor(onSneakPeek, onSneakPeekEnd, allowedByStrategy) {
    super(onSneakPeek, onSneakPeekEnd, allowedByStrategy, false);
  }

  setControllerPlayer(player) {
    this.player = player;
    this.setTogglePeekingState(false);
    return this.updateToggleState();
  }

  stopPeeking() {
    return this.stopPeekingCountDown().then(() => this.updateToggleState());
  }

}
