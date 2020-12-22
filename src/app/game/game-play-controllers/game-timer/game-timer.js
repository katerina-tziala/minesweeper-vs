"use strict";

import { DigitalCounter } from "GamePlayComponents";
import { GameInterval } from "GamePlayControllers";
export class GameTimer extends GameInterval {
  #_digitalCounter;
  #_notificationPoint = 0;
  #onPointNotify;

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

  setNotificationUpdate(onPointNotify, notificationPoint) {
    this.onPointNotify = onPointNotify;
    this.notificationPoint = notificationPoint;
  }

  get #notificationPointReached() {
   return this.notificationPoint > 0 && this.notificationPoint === this.value;
  }


  sendNotification() {
    if (this.#onPointNotify && this.#notificationPointReached) {
      this.#onPointNotify();
    }
  }

  onUpdate() {
    this.digitalCounter.value = this.value;
    this.sendNotification();
  }

  onInit() {
    this.digitalCounter.value = this.value;
  }

  generate() {
    return this.digitalCounter.generate();
  }
}
