"use strict";
import { valueDefined } from "~/_utils/validator";
import { SneakPeekController } from "../_sneak-peek-controller";

export class SneakPeekStrategyController extends SneakPeekController {
  #_opponent;
  #_roundBased;

  constructor(settings, onSneakPeek, onSneakPeekEnd, roundBased = false) {
    super(settings, onSneakPeek, onSneakPeekEnd);
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
    return this.settings ? this.settings.durationWithMargin : 0;
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
    if (!this.#roundBased || !valueDefined(roundSecond)) {
      return true;
    }

    return this.durationWithMargin <= roundSecond;
  }

}
