"use strict";

import { DigitalCounter } from "GamePlayComponents";
import { GameInterval } from "GamePlayControllers";
export class GameTimer extends GameInterval {
  #_digitalCounter;

  constructor(params, onEnd) {
    super();
    this.setConfiguration(params, onEnd);
    this.digitalCounter = new DigitalCounter(params.id);
  }

  set digitalCounter(digitalCounter) {
    this.#_digitalCounter = digitalCounter;
  }

  get digitalCounter() {
    return this.#_digitalCounter;
  }

  onUpdate() {
    this.digitalCounter.value = this.value;
  }

  onInit() {
    this.digitalCounter.value = this.value;
  }

  generate() {
    return this.digitalCounter.generate();
  }
}
