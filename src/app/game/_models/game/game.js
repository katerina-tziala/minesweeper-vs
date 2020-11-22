"use strict";
import { AppModel } from "~/_models/app-model";


export class Game extends AppModel {
  #id;
  #type;
  #levelSettings = undefined;
  #optionsSettings = undefined;
  #turnSettings = undefined;


  #player = undefined;


  // #minesToDetect;
  // #startedAt;
  // #completedAt;
  // #gameOver;
  // #timerSeconds;


  constructor(type, params, player) {
    super();
    this.id = type;
    this.type = type;
    this.player = player;
    this.update(params);
  }

  set id(id) {
    this.#id = id;
  }

  get id() {
    return this.#id;
  }

  set type(type) {
    this.#type = type;
  }

  get type() {
    return this.#type;
  }

  set levelSettings(levelSettings) {
    levelSettings.setMinesPositions();
    this.#levelSettings = levelSettings;
  }

  get levelSettings() {
    return this.#levelSettings;
  }

  set optionsSettings(optionsSettings) {
    this.#optionsSettings = optionsSettings;
  }

  get optionsSettings() {
    return this.#optionsSettings;
  }

  set turnSettings(turnSettings) {
    this.#turnSettings = turnSettings;
  }

  get turnSettings() {
    return this.#turnSettings;
  }

  set player(player) {
    this.#turnSettings = player;
  }

  get player() {
    return this.#player;
  }

}