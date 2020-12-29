"use strict";

import { ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./dashboard-controller.constants";
import {
  DigitalCounter,
  DashboardFaceIcon
} from "GamePlayComponents";

import { GameTimer } from "GamePlayControllers";

export class DashboardController {
  #_gameId;
  #MineCounter;
  #FaceIcon;
  #GameTimer;

  constructor(gameId, turnSettings, onRoundTimerEnd) {
    this.#gameId = gameId;
    this.turnSettings = turnSettings;
    this.#MineCounter = new DigitalCounter(this.#mineCounterId);
    this.#FaceIcon = new DashboardFaceIcon(gameId);
    this.#GameTimer = new GameTimer(turnSettings, this.#timerId, onRoundTimerEnd);
  }

  set #gameId(id) {
    this.#_gameId = id;
  }

  get #gameId() {
    return this.#_gameId;
  }

  get #mineCounterId() {
    return DOM_ELEMENT_ID.mineCounter + this.#_gameId;
  }

  get #timerId() {
    return DOM_ELEMENT_ID.timeCounter + this.#_gameId;
  }

  get #generatedMineCounterContainer() {
    return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.mineCounter], this.#mineCounterId);
  }

  get #generatedTimerContainer() {
    return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.timeCounter], this.#timerId);
  }

  get #generatedFaceIcon() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.faceIcon]);
    container.append(this.#FaceIcon.generateIcon());
    return container;
  }

  #initMinesCounter(minesToDetect) {
    return this.#MineCounter.generate().then(() => {
      this.updateMinesCounter(minesToDetect);
      return;
    });
  }

  get roundTimer() {
    return this.#GameTimer.roundTimer;
  }

  generateView() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.dashboard]);
    container.append(this.#generatedMineCounterContainer);
    container.append(this.#generatedFaceIcon);
    container.append(this.#generatedTimerContainer);
    return container;
  }

  initView(minesToDetect, faceColor) {
    const viewUpdates = [this.setSmileFace(faceColor)];
    viewUpdates.push(this.#initMinesCounter(minesToDetect));
    viewUpdates.push(this.#GameTimer.generate());
    return Promise.all(viewUpdates);
  }

  // MINES COUNTER
  updateMinesCounter(minesToDetect) {
    this.#MineCounter.updateValue(minesToDetect);
  }

  // TIMER
  startTimer() {
    return this.#GameTimer.start();
  }

  stopTimer() {
    return this.#GameTimer.stop();
  }

  continueTimer() {
    return this.#GameTimer.continue();
  }

  get timerRunning() {
    return this.#GameTimer.isRunning;
  }

  setNotificationUpdate(onPointNotify, notificationPoint) {
    return this.#GameTimer.setNotificationUpdate(onPointNotify, notificationPoint);
  }

  get timerValue() {
    return this.#GameTimer.value;
  }

  // FACE ICON
  setSurpriseFace(colorType) {
    return this.#FaceIcon.setSurpriseFace(colorType);
  }

  setRollingEyesFace(colorType) {
    return this.#FaceIcon.setRollingEyesFace(colorType);
  }

  setSmileFace(color) {
    return this.#FaceIcon.setSmileFace(color);
  }

  setLostFace(colorType) {
    return this.#FaceIcon.setLostFace(colorType);
  }

  setWinnerFace(color) {
    return this.#FaceIcon.setWinnerFace(color);
  }

}
