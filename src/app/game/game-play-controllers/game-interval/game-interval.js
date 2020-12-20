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
  }

  set step(step) {
    return (this.#_step = step);
  }

  get step() {
    return this.#_step;
  }

  set limit(limit) {
    return (this.#_limit = limit !== null ? limit : null);
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
    //console.log("ASDASD");
    this.#_timerValue = value;
    //console.log(this.#_timerValue, value);
    this.#checkLimitHit();
  }

  get value() {
    return this.#_timerValue;
  }

  set onEnd(onEnd) {
    if (onEnd) {
      this.#onEnd = onEnd;
    }
  }

  setConfiguration(params, onEnd) {
    this.initialValue = params.initialValue ? params.initialValue : 0;
    this.step = params.step ? params.step : 1;
    this.limit = params.limit;
    this.onEnd = onEnd;
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
      value: this.value
    }
  }

  #checkLimitHit() {
    if (this.hittedLimit) {
      this.#onLimitHit();
    }
  }

  #onLimitHit() {
    this.stop();
    if (this.#onEnd) {
      this.#onEnd();
    }
  }

  #run() {
    this.#_timerInterval = setInterval(() => {
      this.value = this.value + this.step;
      this.onUpdate();
    }, INTERVAL_DURATION);
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
    this.value = this.initialValue;
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

}
