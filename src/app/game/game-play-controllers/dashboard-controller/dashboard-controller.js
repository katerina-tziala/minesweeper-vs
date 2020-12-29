"use strict";

import { ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./dashboard-controller.constants";
export class DashboardController {
  #_gameId;

  constructor(gameId) {
    this.#gameId = gameId;
  }

  set #gameId(id) {
    this.#_gameId = id;
  }

  get #gameId() {
    return this.#_gameId;
  }

  get mineCounterId() {
    return DOM_ELEMENT_ID.mineCounter + this.#_gameId;
  }

  get timerId() {
    return DOM_ELEMENT_ID.timeCounter + this.#_gameId;
  }

  get #generatedMineCounterContainer() {
    return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.mineCounter], this.mineCounterId);
  }

  get #generatedTimerContainer() {
    return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.timeCounter], this.timerId);
  }

  #generateFaceIcon(icon) {
    const container =  ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.faceIcon]);
    container.append(icon);
    return container;
  }

  generateView(icon) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.dashboard]);
    container.append(this.#generatedMineCounterContainer);
    container.append(this.#generateFaceIcon(icon));
    container.append(this.#generatedTimerContainer);
    return container;
  }

}
