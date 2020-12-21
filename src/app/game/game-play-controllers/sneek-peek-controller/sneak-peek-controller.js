"use strict";

import { ElementHandler } from "HTML_DOM_Manager";
import { nowTimestamp } from "~/_utils/dates";
import { SneakPeekSettings } from "GameModels";

import { SneakPeekTimerController } from "./sneak-peek-timer-controller";
import { GameInterval } from "GamePlayControllers";

import { GameViewHelper } from "../../game-play-type/game-default/_game-view-helper";

import { DOM_ELEMENT_ID } from "./sneak-peek-controller.constants";
import {SneakPeekButtonHelper} from  "./sneak-peek-button-helper"
const ROUND_MARGIN = 2;

export class SneakPeekController {
  #_parentElementId;
  #_counterColorType;
  #_playerId;
  #_start;
  #_end;
  #_results = [];

  #timerController;

  constructor(allowedByStrategy = false, roundBased = false) {
    //super();
    // this.onEnd = onEnd;
    this.allowedByStrategy = allowedByStrategy;
    this.roundBased = roundBased;

    // TODO IMPLEMENT SneakPeekCounter and manage sneak peek button

    // TODO IMPLEMENT IN SETTINGS AND PASS MODEL
    this.settings = new SneakPeekSettings();
    this.settings.selected = true;
    this.settings.duration = 3;
    // this.config.limit = 3;

    // this.limit = 0;
    // this.step = -1;
    // this.initialValue = this.config.duration;
    // this.#_results = [];

    this.#timerController = new SneakPeekTimerController(
      this.settings.duration,
      this.#onSneakPeekEnd.bind(this),
    );
    console.log("SneakPeekController");

    console.log(this);
    console.log(this.#timerController);
    this.peekToggle = new SneakPeekButtonHelper(this.#onPeekingToggle.bind(this));
  }

  get #allowed() {
    return this.allowedByStrategy && this.settings.allowed;
  }

  getUpdatedBoardActions(boardActions) {
    if (this.#allowed) {
      const sneakPeekBtn = this.peekToggle.generate();
      boardActions.push(sneakPeekBtn);
    }
    return boardActions;
  }


  updateButtonBasedOnOpponent(opponent) {
    console.log(opponent);
    //this.peekToggle.setState(opponent.hasStrategy);
  }

  
  #onPeekingToggle(peeking) {
    console.log("#onPeekingToggle");
    console.log(peeking);
  }
  #onSneakPeek() {
    console.log("#onSneakPeek");
  }

  #onSneakPeekEnd() {
    console.log("#onSneakPeekEnd");
  }

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
