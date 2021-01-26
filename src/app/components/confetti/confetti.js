"use strict";
import "../../../styles/components/confetti/confetti.scss";

import { ElementHandler } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, COLOR_TYPES, CONFIG } from "./confetti.constants";
import { randomValueFromArray } from "~/_utils/utils";
import { ConfettiFlake } from "./confetti-flake/confetti-flake";
export class Confetti {
  #colorTypes = COLOR_TYPES;
  #confettiFlakes = [];
  #updateRound = 0;
  #height = 0;
  #width = 0;
  #confettiDropped = true;
  #animationActive = false;
  #start;
  #animationTimer;
  #duration = CONFIG.duration;

  constructor() {}

  get #flakeColorType() {
    return randomValueFromArray(this.#colorTypes);
  }

  get #flakeDensity() {
    return Math.random() * CONFIG.numberOfFlakes + Math.ceil(CONFIG.numberOfFlakes / 2);
  }

  get #newFlakeY() {
    return Math.random() * this.#height;
  }

  get #newFlakeX() {
    return Math.random() * this.#width;
  }

  get #initialFlakeY() {
    return this.#newFlakeY - this.#height;
  }

  get #angleDegrees() {
    return this.#updateRound / CONFIG.degreesExtractor;
  }

  #setColorTypes(colorTypes) {
    this.#colorTypes = (colorTypes && colorTypes.length) ? colorTypes : COLOR_TYPES;
  }

  #generateFlakes() {
    const confettiFlakes = [];

    for (let index = 0; index < CONFIG.numberOfFlakes; index++) {
      const flake = new ConfettiFlake(this.#newFlakeX, this.#initialFlakeY, this.#flakeDensity, this.#flakeColorType);
      confettiFlakes.push(flake);
    }

    return confettiFlakes;
  }

  #clearAnimationTimer() {
    this.#confettiDropped = true;
    clearTimeout(this.#animationTimer);
    this.#animationTimer = undefined;
  }

  #init(colorTypes) {
    this.#clearAnimationTimer();
    this.#setColorTypes(colorTypes);
    this.#width = window.innerWidth;
    this.#height = window.innerHeight;
    this.#animationActive = false;
    this.#confettiDropped = true;
    this.#confettiFlakes = this.#generateFlakes();
  }

  #startConfetti() {
    this.#start = undefined;
    this.#confettiDropped = false;
    this.#animationActive = true;
    this.#updateRound = 0;
    this.#animationTimer = this.#setConfettiAnimation();
  }

  #setConfettiAnimation(callBack = this.#animateConfetti.bind(this)) {
    return window.requestAnimationFrame(callBack) ||
      window.webkitRequestAnimationFrame(callBack) ||
      window.mozRequestAnimationFrame(callBack) ||
      window.oRequestAnimationFrame(callBack) ||
      window.msRequestAnimationFrame(callBack) ||
      window.setTimeout(callBack, CONFIG.drawFrame);
  }

  #flakeOutOfCanvas(flake) {
    return flake.outOfCanvas(this.#width, this.#height);
  }

  #repositionFlakeInCanvas(flake, index) {
    if (!this.#animationActive) {
      return;
    }

    if (!this.#flakeOutOfCanvas(flake)) {
      return;
    }

    if (index % 3 > 0 || index % 2 == 0) { // 66.67% OF THE FLAKES
      flake.enterFromTop(this.#newFlakeX);
      return;
    }

    if (Math.sin(this.#angleDegrees) > 0) { // ENTER FROM LEFT
      flake.enterFromLeft(this.#newFlakeY);
      return;
    }

    // ENTER FROM RIGHT
    flake.enterFromRight(this.#width, this.#newFlakeY);
  }

  #animateConfetti(timestamp) {
    if (this.#confettiDropped) {
      this.#clearAnimationTimer();
      return;
    }
    if (this.#start === undefined) {
      this.#start = timestamp;
    }
    const elapsed = timestamp - this.#start;
    this.#drawConfetti().then(() => {
      this.#updateFlakes();
      if (elapsed >= this.#duration) { // Stop the animation after 2 seconds
        this.#animationActive = false;
      }
      this.#animationTimer = this.#setConfettiAnimation();
    });
  }

  #updateFlakes() {
    this.#updateRound++;

    let remainingFlakes = 0;
    this.#confettiFlakes.forEach((flake, index) => {

      if (!this.#animationActive && flake.onTopOfCanvas) {
        flake.setDroppedPosition(this.#height);
        return;
      }

      flake.updateBasedOnAngle(this.#angleDegrees);

      if (!flake.isDropped(this.#height)) {
        remainingFlakes++;
      }

      this.#repositionFlakeInCanvas(flake, index);
    });

    if (remainingFlakes === 0) {
      this.clear();
    }
  }

  drop(colorTypes = [], duration = CONFIG.duration) {
    this.#duration = duration;
    this.#init(colorTypes);

    this.stop().then(() => {
      return this.#initCanvas();
    }).then(() => {
      this.#startConfetti()
    });
  }

  clear() {
    return Promise.all([
      this.stop(),
      this.#removeCanvas()
    ]);
  }

  stop() {
    this.#clearAnimationTimer();
    return this.#initializedCanvasContext.then(() => {
      return;
    }).catch(() => Promise.resolve());
  }

  // INTERFACE
  #createCanvas(container = document.body) {
    const canvas = document.createElement("canvas");
    ElementHandler.setID(canvas, DOM_ELEMENT_ID.canvas);
    container.appendChild(canvas);
    return Promise.resolve();
  }

  #initCanvas(container) {
    return this.#removeCanvas().then(() => {
      return this.#createCanvas(container);
    });
  }

  #removeCanvas() {
    return this.#canvas.then(canvas => canvas.remove()).catch(() => Promise.resolve());
  }

  get #canvas() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.canvas).then(canvas => {
      return canvas;
    });
  }

  get #initializedCanvasContext() {
    return this.#canvas.then(canvas => {
      canvas.width = this.#width;
      canvas.height = this.#height;
      const canvasContext = canvas.getContext("2d");
      canvasContext.clearRect(0, 0, this.#width, this.#height);
      return canvasContext;
    });
  }

  #drawConfetti() {
    return this.#initializedCanvasContext.then(canvasContext => {
      this.#confettiFlakes.forEach(flake => flake.draw(canvasContext));
      return;
    });
  }

}
