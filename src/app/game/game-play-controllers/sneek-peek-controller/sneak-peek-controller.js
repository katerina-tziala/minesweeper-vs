"use strict";
import { nowTimestamp } from "~/_utils/dates";
import { SneakPeekSettings } from "GameModels";

import { SneakPeekTimerController } from "./sneak-peek-timer-controller";
import { SneakPeekButton } from "GamePlayComponents";

const ROUND_MARGIN = 2;

export class SneakPeekController {
  #_player;
  #_opponent;
  #_start;
  #_end;
  #_results = [];
  #onSneakPeek;
  #onSneakPeekEnd;
  #timerController;
  #peekToggle;

  constructor(onSneakPeek, onSneakPeekEnd, allowedByStrategy = true, roundBased = false) {
    this.#onSneakPeek = onSneakPeek;
    this.#onSneakPeekEnd = onSneakPeekEnd;
    this.allowedByStrategy = allowedByStrategy;
    this.roundBased = roundBased;
    this.#peekToggle = new SneakPeekButton(this.#onPeekingToggle.bind(this));

    // TODO IMPLEMENT IN SETTINGS AND PASS MODEL
    this.settings = new SneakPeekSettings();
    this.settings.selected = true;
    this.settings.duration = 3;
    this.settings.limit = 3;

    //
    this.#timerController = new SneakPeekTimerController(this.settings.duration, this.#onSneakPeekEnd);
  }

  set player(player) {
    this.#_player =  player;
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

  set timerControllerParentID(elementId) {
    this.#timerController.parentElementID = elementId;
  }



  get opponent() {
    return this.#_opponent;
  }

  set parentElementID(elementId) {
    this.results = [];
    this.timerControllerParentID = elementId;
  }




  get durationWithMargin() {
    return this.settings ? this.settings.duration + ROUND_MARGIN : 0;
  }

  get isRunning() {
    return this.allowed ? this.#timerController.isRunning : false;
  }

  get isPaused() {
    return  this.allowed ? this.#timerController.isPaused : false;
  }

  get allowed() {
    return this.allowedByStrategy && this.settings.allowed;
  }

  get #peekData() {
    return {
      start: this.#_start,
      end: this.#_end,
      playerId: this.player.id,
    };
  }

  get toggleButton() {
    if (this.allowed) {
      return this.#peekToggle.generate();
    }
    return undefined;
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



  #sneakPeekAllowedInDuration(roundSecond = 0) {
    if (!this.roundBased || !roundSecond) {
      return true;
    }

    return this.durationWithMargin <= roundSecond;
  }

  setPlayers(player, opponent) {
    this.player = player;
    this.#_opponent = opponent;
  }

  updateToggleState(roundSecond = 0) {
    // const disabled = !this.player.isBot ? !this.sneakPeekAllowed(roundSecond): true;
    // const colorType = this.player ? this.player.colorType : undefined;
    // return this.#peekToggle.setState(
    //   disabled,
    //   colorType,
    //   this.playerSneakPeeksLimit,
    // );
  }

  playerPeeking(colorType = this.player.colorType) {
    return this.#timerController.startCountdown(colorType).then(() => {
      this.#setStart();
      return this.#peekToggle.playerPeeking(colorType);
    });
  }

  // playerPeeking() {
  //   return this.#timerController.startCountdown(this.opponent.colorType).then(() => {
  //     this.#setStart();
  //     return this.#peekToggle.playerPeeking(this.player.colorType);
  //   });
  // }
  // stopPeeking() {
  //   return this.#timerController.stopCountDown().then(() => {
  //     this.#setEnd();
  //     this.#updateResults();

  //     this.#peekToggle.peeking = false;
  //     return this.updateToggleState();
  //   });
  // }

  stopPeekingCountDown() {
    return this.#timerController.stopCountDown().then(() => {
      this.#setEnd();
      this.#updateResults();
      this.#peekToggle.peeking = false;
      return;
    });
  }

  // stopPeeking(roundSecond = 0) {
  //   return this.#timerController.stopCountDown().then(() => {
  //     this.#setEnd();
  //     this.#updateResults();
  
  //     this.#peekToggle.peeking = false;
  //     return this.updateToggleState(roundSecond);
  //   });
  // }

  // sneakPeekAllowed(roundSecond) {
  //   if (!this.allowed || !this.player || !this.opponent) {
  //     return false;
  //   }

  //   if (!this.opponent.hasStrategy) {
  //     return false;
  //   }

  //   if (!this.sneakPeekAllowedForPlayer()) {
  //     return false;
  //   }

  //   return this.#sneakPeekAllowedInDuration(roundSecond);
  // }

  stop() {
    this.#timerController.stop();
  }

  continue() {
    this.#timerController.continue();
  }





  ////
  updatePeekToggle(disabled, colorType, limit) {
    if (this.allowed) {
      return this.#peekToggle.setState(disabled, colorType, limit);
    }
    return Promise.resolve();
  }


}
