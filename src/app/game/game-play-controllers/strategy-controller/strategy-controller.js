"use strict";
import { valueDefined } from "~/_utils/validator";

export class StrategyController {
  #_strategyAllowed;
  #_oppenStrategy;
  #_wrongFlagHint;

  constructor(settings, wrongFlagHint) {
    this.strategyAllowed = settings.tileFlagging;
    this.openStrategy = settings.openStrategy;
    this.#_wrongFlagHint = wrongFlagHint;
  }

  set strategyAllowed(tileFlagging) {
    if (valueDefined(tileFlagging)) {
      this.#_strategyAllowed = tileFlagging;
    }
    this.#_strategyAllowed = true;
  }

  get strategyAllowed() {
    return this.#_strategyAllowed;
  }

  set openStrategy(openStrategy) {
    this.#_oppenStrategy = this.strategyAllowed && openStrategy;
  }

  get openStrategy() {
    return this.#_oppenStrategy;
  }

  get hiddenStrategy() {
    return this.strategyAllowed ? !this.openStrategy : false;
  }

  #playerStrategy(player) {
    return this.hiddenStrategy && player.hasStrategy;
  }

  #hideStrategyForPlayer(player, mineField) {
    if (this.#playerStrategy(player)) {
      mineField.hideStrategy(player);
      return Promise.resolve();
    }

    return Promise.resolve();
  }

  #displayStrategyForPlayer(player, mineField) {
    if (this.#playerStrategy(player)) {
      mineField.showStrategy(player, this.#_wrongFlagHint);
      return Promise.resolve();
    }

    return Promise.resolve();
  }

  revealOpponentStrategy(player, opponent, mineField) {
    const interfaceUpdates = [];
    interfaceUpdates.push(this.#hideStrategyForPlayer(player, mineField));
    interfaceUpdates.push(this.#displayStrategyForPlayer(opponent, mineField));
    return Promise.all(interfaceUpdates);
  }

  hideOpponentStrategy(player, opponent, mineField) {
    const interfaceUpdates = [];
    interfaceUpdates.push(this.#hideStrategyForPlayer(opponent, mineField));
    interfaceUpdates.push(this.#displayStrategyForPlayer(player, mineField));
    return Promise.all(interfaceUpdates);
  }

}
