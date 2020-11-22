"use strict";
import { AppModel } from "~/_models/app-model";


export class Game extends AppModel {
  #id;
  #type;
  #levelSettings = undefined;
  #optionsSettings = undefined;
  #turnSettings = undefined;


  #player = undefined;
  #opponent = undefined;


  // #minesToDetect;
  // #startedAt;
  // #completedAt;
  // #gameOver;
  // #timerSeconds;


  constructor(type, params, player, opponent) {
    super();
    this.id = type;
    this.type = type;
    this.player = player;
    this.opponent = opponent;
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
    this.#player = player;
  }

  get player() {
    return this.#player;
  }

  set opponent(player) {
    this.#opponent = player;
  }

  get opponent() {
    return this.#opponent;
  }



}