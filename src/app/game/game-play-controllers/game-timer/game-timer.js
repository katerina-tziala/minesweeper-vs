"use strict";

import { DigitalCounter } from "GamePlayComponents";
import { GameInterval } from "GamePlayControllers";
export class GameTimer extends GameInterval {
  #_digitalCounter;
  #_notificationPoint = 0;
  #_turnSettings;
  #onPointNotify;

  constructor(turnSettings, parentId, onEnd) {
    super();
    this.#turnSettings = turnSettings;
    this.setConfiguration(this.#gameTimerSettings, onEnd);
    this.#digitalCounter = new DigitalCounter(parentId);
  }

  set #turnSettings(settings) {
    this.#_turnSettings = settings;
  }

  get #turnSettings() {
    return this.#_turnSettings;
  }

  get roundTimer() {
    return this.#turnSettings && this.#turnSettings.roundTimer;
  }

  get #gameTimerSettings() {
    let step = 1;
    let limit = null;
    let initialValue = 0;

    if (this.roundTimer) {
      step = -1;
      limit = 0;
      initialValue = this.#turnSettings.turnDuration;
    }
    return { step, limit, initialValue };
  }

  set #digitalCounter(digitalCounter) {
    this.#_digitalCounter = digitalCounter;
  }

  get #digitalCounter() {
    return this.#_digitalCounter;
  }

  set notificationPoint(notificationPoint) {
    this.#_notificationPoint = notificationPoint;
  }

  get notificationPoint() {
    return this.#_notificationPoint;
  }

  set onPointNotify(onPointNotify) {
    if (onPointNotify) {
      this.#onPointNotify = onPointNotify;
    }
  }

  get #notificationPointReached() {
    return this.notificationPoint > 0 && this.notificationPoint === this.value;
  }

  #sendNotification() {
    if (this.#onPointNotify && this.#notificationPointReached) {
      this.#onPointNotify();
    }
  }

  #updateDigitalCounter() {
    this.#digitalCounter.updateValue(this.value);
  }

  onUpdate() {
    this.#updateDigitalCounter();
    this.#sendNotification();
  }

  onInit() {
    this.#updateDigitalCounter();
  }

  generate() {
    this.stop();
    this.value = this.initialValue;
    return this.#digitalCounter.generate().then(() => {
      this.#updateDigitalCounter();
      return;
    });
  }

  setNotificationUpdate(onPointNotify, notificationPoint) {
    this.onPointNotify = onPointNotify;
    this.notificationPoint = notificationPoint;
  }

  start(startValue) {
    this.stop();
    if (startValue) {
      this.value = startValue;
      this.#updateDigitalCounter();
    } else {
      this.init();
    }
    this.run();
  }
}
