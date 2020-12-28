"use strict";

import { SneakPeekController } from "../_sneak-peek-controller";

const ROUND_MARGIN = 2;

export class SneakPeekStrategyController extends SneakPeekController {
  #_opponent;
  #_roundBased;

  constructor(onSneakPeek, onSneakPeekEnd, allowedByStrategy = true, roundBased = false) {
    super(onSneakPeek, onSneakPeekEnd, allowedByStrategy, false);
    this.#roundBased = roundBased;
  }

  set #roundBased(roundBased) {
    this.#_roundBased = roundBased;
  }

  get #roundBased() {
    return this.#_roundBased;
  }

  set #opponent(opponent) {
    this.#_opponent = opponent;
  }

  get #opponent() {
    return this.#_opponent;
  }

  get durationWithMargin() {
    return this.settings ? this.settings.duration + ROUND_MARGIN : 0;
  }

  setPlayers(player, opponent) {
    this.player = player;
    this.#opponent = opponent;
  }

  updateToggleState(roundSecond = 0) {
    const disabled = !this.player.isBot ? !this.sneakPeekAllowed(roundSecond): true;
    return this.updatePeekToggle(disabled);
  }

  stopPeeking(roundSecond = 0) {
    return this.stopPeekingCountDown().then(() => this.updateToggleState(roundSecond));
  }

  sneakPeekAllowed(roundSecond) {
    if (!this.allowed || !this.player || !this.timerControllerParentID || !this.#opponent) {
      return false;
    }

    if (!this.#opponent.hasStrategy) {
      return false;
    }

    if (!this.sneakPeekAllowedForPlayer) {
      return false;
    }

    return this.#sneakPeekAllowedInDuration(roundSecond);
  }

  #sneakPeekAllowedInDuration(roundSecond = 0) {
    if (!this.#roundBased || !roundSecond) {
      return true;
    }

    return this.durationWithMargin <= roundSecond;
  }

}
