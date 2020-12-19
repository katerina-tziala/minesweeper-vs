"use strict";

import { DigitalCounter } from "../digital-counter/digital-counter";
export class GameTimer {
  #_limit;
  #_step;
  #_initialValue;
  #_timerInterval;
  #_digitalCounter;
  #onTimerStopped;

  constructor(params, onTimerStopped) {
    this.setConfiguration(params, onTimerStopped);
    this.digitalCounter = new DigitalCounter(params.id);
  }

  setConfiguration(params, onTimerStopped) {
    this.initialValue = params.initialValue ? params.initialValue : 0;
    this.step = params.step ? params.step : 1;
    this.limit = params.limit;
    this.onTimerStopped = onTimerStopped;
  }

  get state() {
    return {
      initialValue: this.initialValue,
      step: this.step,
      limit: this.limit,
      isRunning: this.isRunning,
      hittedLimit: this.hittedLimit,
      value: this.value
    }
  }

  set onTimerStopped(onTimerStopped) {
    if (onTimerStopped) {
      this.#onTimerStopped = onTimerStopped;
    }
  }

  #checkLimitHit() {
    if (this.hittedLimit) {
      this.#onLimitHit();
    }
  }

  #onLimitHit() {
    this.stop();
    if (this.#onTimerStopped) {
      this.#onTimerStopped();
    }
  }

  #run() {
    this.#_timerInterval = setInterval(() => {
      this.value = this.value + this.step;
    }, 1000);
  }

  get isRunning() {
    return this.#_timerInterval ? true : false;
  }

  set limit(limit) {
    return (this.#_limit = limit !== null ? limit : null);
  }

  get limit() {
    return this.#_limit;
  }

  set step(step) {
    return (this.#_step = step);
  }

  get step() {
    return this.#_step;
  }

  get hittedLimit() {
    return this.limit !== null && this.digitalCounter.value === this.limit;
  }

  set digitalCounter(digitalCounter) {
    return (this.#_digitalCounter = digitalCounter);
  }

  get digitalCounter() {
    return this.#_digitalCounter;
  }

  set value(value) {
    this.digitalCounter.value = value;
    this.#checkLimitHit();
  }

  get value() {
    return this.digitalCounter.value;
  }

  set initialValue(value) {
    this.#_initialValue = value;
  }

  get initialValue() {
    return this.#_initialValue;
  }

  stop() {
    clearInterval(this.#_timerInterval);
    this.#_timerInterval = undefined;
  }

  init() {
    this.value = this.initialValue;
  }

  start() {
    this.stop();
    this.init();
    this.#run();
  }

  continue() {
    this.stop();
    this.value = this.value;
    if (this.hittedLimit) {
      this.#onLimitHit();
      return;
    }
    this.#run();
  }

  generate() {
    return this.digitalCounter.generate();
  }
}
