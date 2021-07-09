'use strict';
import '~/ui-elements/custom-elements/digital-counters/digital-timer/DigitalTimer';
import './game-timer.scss';
import { ATTRIBUTES, TEMPLATE, CONFIG } from './game-timer.constants';
import { NumberValidation } from 'UTILS';
const INTERVAL_DURATION = 1000;

export default class GameTimer extends HTMLElement {
  #config;
  #timer;
  #currentValue = 0;
  #timerInterval = 0;

  constructor() {
    super();
  }

  get #turnTimer() {
    return !!this.turnDuration;
  }

  get turnDuration() {
    const turnDuration = this.getAttribute(ATTRIBUTES.turnDuration);
    return NumberValidation.numberFromString(turnDuration);
  }

  get running() {
    return !!this.#timerInterval;
  }

  connectedCallback() {
    this.setAttribute(ATTRIBUTES.turnDuration, this.turnDuration);
    this.#setConfig();
    this.#resetValue();
    this.#render();
  }

  disconnectedCallback() {
    this.#clearTimer();
  }

  start(initialValue = this.#config.startValue) {
    this.#clearTimer();
    this.#currentValue = initialValue;
    this.#setTimerValue();
    this.#startTimer();
  }

  reset(initialValue = this.#config.startValue) {
    this.stop();
    this.#currentValue = initialValue;
    this.#setTimerValue();
  }

  stop() {
    this.#clearTimer();
    this.#setTimerAliveState();
  }

  continue() {
    this.#startTimer();
  }

  #startTimer() {
    this.#timerInterval = setInterval(this.#onTimerUpdate.bind(this), INTERVAL_DURATION);
    this.#setTimerAliveState();
  }

  #clearTimer() {
    clearInterval(this.#timerInterval);
    this.#timerInterval = 0;
  }

  #onTimerUpdate() {
    this.#currentValue += this.#config.step;
    this.#setTimerValue();
    this.#checkTimerEnd();
  }

  #checkTimerEnd() {
   if (this.#currentValue === 0) {
      this.stop();
      this.dispatchEvent(new CustomEvent('onTurnEnd'));
    }
  }

  #resetValue() {
    this.#currentValue = this.#config.startValue;
  }

  #setConfig() {
    let config = { ...CONFIG.gameTimer };
    if (this.#turnTimer) {
      config = { ...CONFIG.turnTimer };
      config.startValue = this.turnDuration;
    }
    this.#config = config;
  }

  #render() {
    this.#timer = document.createElement('app-digital-timer');
    this.#timer.setAttribute('format', this.#config.format);
    this.#setTimerAliveState(false);
    this.#setTimerValue();
    this.innerHTML = TEMPLATE;
    this.append(this.#timer);
  }

  #setTimerValue() {
    if (this.#timer) {
      this.#timer.setAttribute('seconds', this.#currentValue);
    }
  }

  #setTimerAliveState() {
    if (this.#timer) {
      this.#timer.setAttribute('alive', this.running);
    }
  }

}

customElements.define('app-game-timer', GameTimer);