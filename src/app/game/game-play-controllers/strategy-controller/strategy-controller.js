"use strict";

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
    if (tileFlagging !== undefined) {
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

  #strategyUpdate(player) {
    return this.hiddenStrategy && player.hasStrategy;
  }

  #hideStrategyForPlayer(player, mineField) {
    console.log(this.#strategyUpdate(player));
    if (this.#strategyUpdate(player)) {
      mineField.hideStrategy(player);
      return Promise.resolve();
    }

    return Promise.resolve();
  }

  #displayStrategyForPlayer(player, mineField) {
    if (this.#strategyUpdate(player)) {
      mineField.showStrategy(player, this.#_wrongFlagHint);
      return Promise.resolve();
    }

    return Promise.resolve();
  }

  revealOpponentStrategy(player, opponent, mineField) {
    const interfaceUpdates = [];
    interfaceUpdates.push(this.#hideStrategyForPlayer(opponent, mineField));
    interfaceUpdates.push(this.#displayStrategyForPlayer(player, mineField));
    return Promise.all(interfaceUpdates);
  }

  hideOpponentStrategy(player, opponent, mineField) {
    const interfaceUpdates = [];
    interfaceUpdates.push(this.#hideStrategyForPlayer(opponent, mineField));
    interfaceUpdates.push(this.#displayStrategyForPlayer(player, mineField));
    return Promise.all(interfaceUpdates);
  }

}
