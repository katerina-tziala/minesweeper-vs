"use strict";
import { valueDefined } from "~/_utils/validator";

export class StrategyController {
  #_strategyAllowed;
  #_oppenStrategy;

  constructor(settings) {
    this.strategyAllowed = settings.tileFlagging;
    this.openStrategy = settings.openStrategy;
  }

  set strategyAllowed(tileFlagging) {
    if (valueDefined(tileFlagging)) {
      this.#_strategyAllowed = tileFlagging;
      return;
    }
    this.#_strategyAllowed = true;
  }

  get strategyAllowed() {
    return this.#_strategyAllowed;
  }

  set openStrategy(openStrategy) {
    if (valueDefined(openStrategy)) {
      this.#_oppenStrategy = this.strategyAllowed && openStrategy;
      return;
    }
    this.#_oppenStrategy = true;
  }

  get openStrategy() {
    return this.#_oppenStrategy;
  }

  get hiddenStrategy() {
    return this.strategyAllowed ? !this.openStrategy : false;
  }

  playerHasStrategy(player) {
    return this.hiddenStrategy && player.hasStrategy;
  }

}
