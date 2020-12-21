"use strict";
import { nowTimestamp } from "~/_utils/dates";
import { SneakPeekSettings } from "GameModels";

import { SneakPeekTimerController } from "./sneak-peek-timer-controller";
import { SneakPeekButton } from "GamePlayComponents";

const ROUND_MARGIN = 2;

export class SneakPeekController {
  #_playerId;
  #_start;
  #_end;
  #_results = [];
  #onSneakPeek;
  #onSneakPeekEnd;
  #timerController;
  #peekToggle;

  constructor(onSneakPeek, onSneakPeekEnd, allowedByStrategy = false, roundBased = false) {
    this.#onSneakPeek = onSneakPeek;
    this.#onSneakPeekEnd = onSneakPeekEnd;
    this.allowedByStrategy = allowedByStrategy;
    this.roundBased = roundBased;

    // update on round timer
    this.#peekToggle = new SneakPeekButton(this.#onPeekingToggle.bind(this));

    // TODO IMPLEMENT IN SETTINGS AND PASS MODEL
    this.settings = new SneakPeekSettings();
    this.settings.selected = true;
    this.settings.duration = 3;
    this.settings.limit = 3;

    //
    this.#timerController = new SneakPeekTimerController(this.settings.duration, this.#onSneakPeekEnd);
  }

  set playerID(id) {
    this.#_playerId = id;
  }

  get playerID() {
    return this.#_playerId;
  }

  set parentElementID(elementId) {
    this.#_results = [];
    this.#timerController.parentElementID = elementId;
  }

  get results() {
    return this.#_results;
  }

  #setStart() {
    this.#_start = nowTimestamp();
  }

  #setEnd() {
    this.#_end = nowTimestamp();
  }

  get #allowed() {
    return this.allowedByStrategy && this.settings.allowed;
  }

  get #peekData() {
    return {
      start: this.#_start,
      end: this.#_end,
      playerId: this.playerID,
    };
  }

  #updateResults() {
    this.#_results.push(this.#peekData);
  }

  #onPeekingToggle(peek) {
    peek ? this.#onSneakPeek() : this.#onSneakPeekEnd();
  }

  getUpdatedBoardActions(boardActions) {
    if (this.#allowed) {
      const sneakPeekBtn = this.#peekToggle.generate();
      boardActions.push(sneakPeekBtn);
    }
    return boardActions;
  }

  updateToggleState(player, opponent, roundSecond) {
    const disabled = !player.isBot ? !this.sneakPeekAllowed(player, opponent, roundSecond): true;
    const colorType = player ? player.colorType : undefined;
    this.#peekToggle.setState(
      disabled,
      colorType,
      this.#playerSneakPeeksLimit(player.id),
    );
  }

  playerPeeking(player, opponent) {
    this.playerID = player.id;
    this.#peekToggle.playerPeeking(player.colorType);
    this.#timerController.startCountdown(opponent.colorType);
    this.#setStart();
  }

  stopPeeking(player, opponent) {
    this.#timerController.stopCountDown();

    this.#setEnd();
    this.#updateResults();

    this.#peekToggle.peeking = false;
    this.updateToggleState(player, opponent);
  }

  #playerSneakPeeks(playerId) {
    return this.results.filter((result) => result.playerId === playerId).length;
  }

  #playerSneakPeeksLimit(playerId) {
    if (this.settings.limit === null) {
      return null;
    }
    return this.settings.limit - this.#playerSneakPeeks(playerId);
  }

  #sneakPeekAllowedForPlayer(playerId) {
    if (this.settings.limit === null) {
      return true;
    }
    return this.#playerSneakPeeks(playerId) < this.settings.limit;
  }

  #sneakPeekAllowedInDuration(roundSecond = 0) {
    if (!this.roundBased || !roundSecond) {
      return true;
    }

    const actualPeakDuration = this.settings.duration + ROUND_MARGIN;
    return actualPeakDuration <= roundSecond;
  }

  sneakPeekAllowed(player, opponent, roundSecond) {
    if (!this.#allowed) {
      return false;
    }

    if (!opponent.hasStrategy) {
      return false;
    }

    if (!this.#sneakPeekAllowedForPlayer(player.id)) {
      return false;
    }

    return this.#sneakPeekAllowedInDuration(roundSecond);
  }

  get isRunning() {
    return this.#timerController.isRunning;
  }

  get isPaused() {
    return this.#timerController.isPaused;
  }

  stop() {
    this.#timerController.stop();
  }

  continue() {
    this.#timerController.continue();
  }

}
