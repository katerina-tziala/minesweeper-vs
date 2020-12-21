"use strict";

import { ElementHandler } from "HTML_DOM_Manager";
import { nowTimestamp } from "~/_utils/dates";
import { SneakPeekSettings } from "GameModels";

import { SneakPeekCounter } from "GamePlayComponents";
import { GameInterval } from "GamePlayControllers";

const ROUND_MARGIN = 2;

export class SneakPeekTimerController extends GameInterval {
  #_parentElementId;
  #_counterColorType;
  #_playerId;
  #_start;
  #_end;
  #_results = [];

  constructor(initialValue, onEnd) {
    super();
    this.limit = 0;
    this.step = -1;
    this.initialValue = initialValue;
    this.onEnd = onEnd;
    
  
   
    // this.initialValue = initialValue;
    // // TODO IMPLEMENT SneakPeekCounter and manage sneak peek button

    // // TODO IMPLEMENT IN SETTINGS AND PASS MODEL
    // this.config = new SneakPeekSettings();
    // this.config.allowed = true;
    // this.config.duration = 3;
    // this.config.limit = 3;

  
    
    // this.#_results = [];

    console.log("SneakPeekCounterController");

    console.log(this);
  }

  // get allowed() {
  //   return this.config.allowed && (this.config.duration > 0);
  // }

  // set playerID(id) {
  //   this.#_playerId = id;
  // }

  // get playerID() {
  //   return this.#_playerId;
  // }

  // set parentElementID(elementId) {
  //   this.#_results = [];
  //   this.#_parentElementId = elementId;
  // }

  // get parentElementID() {
  //   return this.#_parentElementId;
  // }

  // set counterColorType(type) {
  //   this.#_counterColorType = type;
  // }

  // get counterColorType() {
  //   return this.#_counterColorType;
  // }

  // #setStart() {
  //   this.#_start = nowTimestamp();
  // }

  // #setEnd() {
  //   this.#_end = nowTimestamp();
  // }

  // get #peekData() {
  //   return {
  //     start: this.#_start,
  //     end: this.#_end,
  //     playerId: this.playerID,
  //   };
  // }

  // updateResults() {
  //   this.#_results.push(this.#peekData);
  // }

  // get results() {
  //   return this.#_results;
  // }

  // onInit() {
  //   SneakPeekCounter.updateValue(this.value, this.counterColorType);
  // }

  // onUpdate() {
  //   SneakPeekCounter.updateValue(this.value, this.counterColorType);
  // }

  // get #counterParent() {
  //   return ElementHandler.getByID(this.parentElementID);
  // }

  // #playerSneakPeeks(player) {
  //   return this.results.filter((result) => result.playerId === player.id)
  //     .length;
  // }

  // #sneakPeekAllowedForPlayer(player) {
  //   if (this.config.limit === null) {
  //     return true;
  //   }
  //   return this.#playerSneakPeeks(player) < this.config.limit;
  // }

  // #sneakPeekAllowedInDuration(roundSecond = 0) {
  //   if (!this.roundBased) {
  //     return true;
  //   }

  //   const actualPeakDuration = this.config.duration + ROUND_MARGIN;
  //   return actualPeakDuration <= roundSecond;
  // }

  // sneakPeekAllowed(playerOnTurn, playerWaiting, roundSecond) {
  //   if (!this.parentElementID || !this.config.allowed) {
  //     return false;
  //   }

  //   if (!playerWaiting.hasStrategy) {
  //     return false;
  //   }

  //   if (!this.#sneakPeekAllowedForPlayer(playerOnTurn)) {
  //     return false;
  //   }

  //   if (!this.#sneakPeekAllowedInDuration(roundSecond)) {
  //     return false;
  //   }

  //   return this.#sneakPeekAllowedInDuration(roundSecond);
  // }

  // startCountdown(playerId, colorType) {
  //   this.playerID = playerId;
  //   this.counterColorType = colorType;

  //   this.stop();
  //   this.#counterParent.then((container) => {
  //     container.append(SneakPeekCounter.generate);
  //     ElementHandler.display(container);
  //     this.#setStart();
  //     this.start();
  //   });
  // }

  // endCountdown() {
  //   this.stop();
  //   this.#setEnd();
  //   this.#counterParent.then((container) => {
  //     ElementHandler.clearContent(container);
  //     this.updateResults();
  //   });
  // }
}
