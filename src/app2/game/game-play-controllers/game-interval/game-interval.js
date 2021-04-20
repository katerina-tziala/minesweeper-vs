"use strict";
const INTERVAL_DURATION = 1000;

export class GameInterval {
  #_limit;
  #_step;
  #_initialValue;
  #_timerValue;
  #_timerInterval;
  #onEnd;

  constructor() {
    this.initialValue = 0;
    this.step = 0;
    this.value = 0;
  }

  set step(step) {
    this.#_step = step;
  }

  get step() {
    return this.#_step;
  }

  set limit(limit) {
    this.#_limit = limit !== null ? limit : null;
  }

  get limit() {
    return this.#_limit;
  }

  set initialValue(value) {
    this.#_initialValue = value;
  }

  get initialValue() {
    return this.#_initialValue;
  }

  set value(value) {
    this.#_timerValue = value;
    this.#checkLimitHit();
  }

  get value() {
    return this.#_timerValue;
  }

  get isPaused() {
    return !this.isRunning && this.#_timerValue > 0;
  }

  set onEnd(onEnd) {
    if (onEnd) {
      this.#onEnd = onEnd;
    }
  }

  get isRunning() {
    return this.#_timerInterval ? true : false;
  }

  get hittedLimit() {
    return this.limit !== null && this.#_timerValue === this.limit;
  }

  get state() {
    return {
      initialValue: this.initialValue,
      step: this.step,
      limit: this.limit,
      isRunning: this.isRunning,
      hittedLimit: this.hittedLimit,
      value: this.value,
    };
  }

  #checkLimitHit() {
    if (this.hittedLimit) {
      this.#onLimitHit();
    }
  }

  #onLimitHit() {
    this.stop();
    this.submitEnd();
  }

  submitEnd() {
    if (this.#onEnd) {
      this.#onEnd();
    }
  }

  run() {
    this.#_timerInterval = setInterval(() => {
      this.value = this.value + this.step;
      this.onUpdate();
    }, INTERVAL_DURATION);
  }

  setConfiguration(params, onEnd) {
    this.initialValue = params.initialValue ? params.initialValue : 0;
    this.step = params.step ? params.step : 1;
    this.limit = params.limit;
    this.onEnd = onEnd;
  }

  onUpdate() {
    return;
  }

  onInit() {
    return;
  }

  init() {
    this.value = this.initialValue;
    this.onInit();
  }

  stop() {
    clearInterval(this.#_timerInterval);
    this.#_timerInterval = undefined;
  }

  start() {
    this.stop();
    this.init();
    this.run();
  }

  continue() {
    this.stop();
    if (this.hittedLimit) {
      this.#onLimitHit();
      return;
    }
    this.run();
  }
}
