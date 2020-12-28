"use strict";
import { nowTimestamp } from "~/_utils/dates";
import { SneakPeekSettings } from "GameModels";

import { SneakPeekTimerController } from "./_sneak-peek-timer-controller";
import { SneakPeekButton } from "GamePlayComponents";

export class SneakPeekController {
  #_player;
  #_start;
  #_end;
  #_results = [];
  #onSneakPeek;
  #onSneakPeekEnd;
  #timerController;
  #peekToggle;

  constructor(onSneakPeek, onSneakPeekEnd, allowedByStrategy = true) {
    this.#onSneakPeek = onSneakPeek;
    this.#onSneakPeekEnd = onSneakPeekEnd;
    this.allowedByStrategy = allowedByStrategy;

    this.#peekToggle = new SneakPeekButton(this.#onPeekingToggle.bind(this));

    // TODO IMPLEMENT IN SETTINGS AND PASS MODEL
    this.settings = new SneakPeekSettings();
    this.settings.selected = true;
    this.settings.duration = 3;
    this.settings.limit = 3;
    //

    this.#timerController = new SneakPeekTimerController(this.settings.duration, this.#onSneakPeekEnd);
  }

  get sneakPeekAllowed() {
    if (!this.allowed || !this.player || !this.timerControllerParentID) {
      return false;
    }

    return this.sneakPeekAllowedForPlayer;
  }

  get #peekData() {
    return {
      start: this.#_start,
      end: this.#_end,
      playerId: this.player.id,
    };
  }

  #setStart() {
    this.#_start = nowTimestamp();
  }

  #setEnd() {
    this.#_end = nowTimestamp();
  }

  #updateResults() {
    this.#_results.push(this.#peekData);
  }

  #onPeekingToggle(peek) {
    peek ? this.#onSneakPeek() : this.#onSneakPeekEnd();
  }

  set player(player) {
    this.#_player = player;
  }

  get player() {
    return this.#_player;
  }

  get playerSneakPeeks() {
    return this.player ? this.results.filter((result) => result.playerId === this.player.id).length : 0;
  }

  get playerSneakPeeksLimit() {
    if (this.settings.limit === null) {
      return null;
    }
    return this.settings.limit - this.playerSneakPeeks;
  }

  get sneakPeekAllowedForPlayer() {
    if (this.settings.limit === null) {
      return true;
    }
    return this.playerSneakPeeks < this.settings.limit;
  }

  set results(results) {
    return this.#_results = results;
  }

  get results() {
    return this.#_results;
  }

  set parentElementID(elementId) {
    this.results = [];
    this.#timerController.parentElementID = elementId;
  }

  get timerControllerParentID() {
    return this.#timerController.parentElementID;
  }

  get allowed() {
    return this.allowedByStrategy && this.settings.allowed;
  }

  get isRunning() {
    return this.allowed ? this.#timerController.isRunning : false;
  }

  get isPaused() {
    return this.allowed ? this.#timerController.isPaused : false;
  }

  get toggleButton() {
    if (this.allowed) {
      return this.#peekToggle.generate();
    }
    return undefined;
  }

  stop() {
    this.#timerController.stop();
  }

  continue() {
    this.#timerController.continue();
  }

  updatePeekToggle(disabled) {
    if (this.allowed) {
      return this.#peekToggle.setState(disabled, this.player.colorType, this.playerSneakPeeksLimit);
    }
    return Promise.resolve();
  }

  playerPeeking(colorType = this.player.colorType) {
    return this.#timerController.startCountdown(colorType).then(() => {
      this.#setStart();
      return this.#peekToggle.playerPeeking(colorType);
    });
  }

  updateToggleState() {
    return this.updatePeekToggle(!this.sneakPeekAllowed);
  }

  stopPeekingCountDown() {
    return this.#timerController.stopCountDown().then(() => {
      this.#setEnd();
      this.#updateResults();
      this.setTogglePeekingState(false);
      return;
    });
  }

  setTogglePeekingState(state) {
    this.#peekToggle.peeking = state;
  }

}
