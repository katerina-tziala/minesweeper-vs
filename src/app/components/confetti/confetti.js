"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONFETTI_COLORS, CONFIG } from "./confetti.constants";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import "../../../styles/components/confetti/confetti.scss";
import { ConfettiParticle } from "./confetti-particle";

import { randomValueFromArray } from "~/_utils/utils";
export class Confetti {
  #_gameId;

  constructor() {
    console.log("Confetti");

    this.colors = [];


    this.confettiFlakes = [];
    this.animationActive = false;
    this.animationCompleted = false;
    this.width = 0;
    this.height = 0;

    this.particlesNumber = 20;
    this.density = Math.random() * this.particlesNumber;

    this.angle = 0;
    this.tiltAngle = 0;

    this.deactivationTimerHandler = undefined;
    this.reactivationTimerHandler = undefined;
    this.animationHandler = undefined;
  }

  get #newFlakeVerticalPosition() {
    return Math.random() * this.height;
  }

  get #newFlakeHorizontalPosition() {
    return Math.random() * this.width;
  }

  get #initialFlakeVerticalPosition() {
    return (Math.random() * this.height) - this.height;
  }

  get #newFlakeDensity() {
   // this.d = (Math.random() * mp) + 90; //density;
    return Math.random() * this.particlesNumber;
  }

  setColors(colorTypes, theme = LocalStorageHelper.selectedTheme) {
    const colorsBasedOnTheme = CONFETTI_COLORS[theme];
    const colorKeys = colorTypes.length ? colorTypes : Object.keys(colorsBasedOnTheme);
    const colors = [];
    for (const [key, value] of Object.entries(colorsBasedOnTheme)) {
      if (colorKeys.includes(key)) {
        colors.push(value);
      }
    }
    this.colors = colors;
  }


  #init(colorTypes) {
    this.setColors(colorTypes);
    this.animationCompleted = false;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.confettiFlakes = this.#generateParticles();
  }

  #generateParticles() {
    const confettiFlakes = [];
    for (let index = 0; index < this.particlesNumber; index++) {
      const particleColor = randomValueFromArray(this.colors);
      const particle = new ConfettiParticle(particleColor, this.#newFlakeHorizontalPosition, this.#initialFlakeVerticalPosition, this.#newFlakeDensity);
      confettiFlakes.push(particle);
    }
    return confettiFlakes;
  }

  get #canvasContext() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.canvas).then(canvas => {
      canvas.width = this.width;
      canvas.height = this.height;
      return canvas.getContext("2d")
    });
  }

  get #canvasClearedContext() {
    return this.#canvasContext.then(canvasContext => {
      canvasContext.clearRect(0, 0, this.width, this.height);
      return canvasContext;
    });
  }



  generateView() {
    const canvas = document.createElement("canvas");
    ElementHandler.setID(canvas, DOM_ELEMENT_ID.canvas);
    document.body.appendChild(canvas);
    this.dropConfetti();
  }



  #drawConfetti() {
    return this.#canvasClearedContext.then(canvasContext => {
      this.confettiFlakes.forEach(flake => flake.draw(canvasContext));
      return;
    });
  }

  dropConfetti(colorTypes = []) {
    this.#init(colorTypes);

    this.stop().then(() => {

      console.log("dropConfetti");



      console.log("stopped");
      this.angle = 0;
      this.tiltAngle = 0;
      this.animationCompleted = false;
      this.animationActive = true;
      this.#startConfetti();
    });
  }



  #startConfetti() {
    this.start = undefined;
    this.animationHandler = this.#setConfettiAnimation();
    // this.confettiFlakes = [];
    // this.confettiFlakes.push(new ConfettiParticle(randomValueFromArray(this.colors), 10, 10, this.#newFlakeDensity));
    // this.confettiFlakes.push(new ConfettiParticle(randomValueFromArray(this.colors), this.width, this.height, this.#newFlakeDensity));
    // this.#drawConfetti();
   
    // console.log(this.confettiFlakes);
  }

  #setConfettiAnimation(callBack = this.#animateConfetti.bind(this)) {
    return window.requestAnimationFrame(callBack) ||
      window.webkitRequestAnimationFrame(callBack) ||
      window.mozRequestAnimationFrame(callBack) ||
      window.oRequestAnimationFrame(callBack) ||
      window.msRequestAnimationFrame(callBack) ||
      window.setTimeout(callBack, 1000 / 60);
  }


  // 

  #animateConfetti(timestamp) {

    if (this.animationCompleted) {
      console.log("animationCompleted stooop");
      // this.stop().then(() => {
      //   console.log("stopped");
      // });
      return 0;
    }

    if (this.start === undefined) {
      this.start = timestamp;
    }

    const elapsed = timestamp - this.start;

    //console.log(elapsed);

    this.#drawConfetti().then(() => {
      this.#updateParticles();

      if (elapsed >= 5000) { // Stop the animation after 2 seconds
        this.animationActive = false;
      }
      
      this.animationHandler = this.#setConfettiAnimation();
    })

  }




  get #angleDegrees() {
    return ;
  }


  #updateParticles() {
    console.log("#updateParticles");
    
    let remainingFlakes = 0;
 
    
    this.angle++;
    this.tiltAngle++;


    this.confettiFlakes.forEach((flake, index) => {
      if (!this.animationActive && flake.isOnTopOfCanvas()) {
        flake.setDroppedPosition(this.height);
        return;
      }

      flake.updatePositionBasedOnAngle(this.#angleDegrees);

      if (!flake.isDropped(this.height)) {
        remainingFlakes++;
      }
    
      this.#repositionFlakeInCanvas(flake, index);
    });




    if (remainingFlakes === 0) {
      console.log("no remainingFlakes");
      console.log(remainingFlakes);
      this.#clearTimers();

      console.log(this.height);
      console.log(this.confettiFlakes);

      this.animationCompleted = true;
    }

  }

  #flakeOutOfCanvas(flake) {
    if (!this.animationActive) {
      return false;
    }
    return flake.outOfCanvas(this.width, this.height);
  }

  #repositionFlakeInCanvas(flake, index) {
    if (!this.#flakeOutOfCanvas(flake)) {
      return;
    }

    if (index % 3 > 0 || index % 2 == 0) { // 66.67% OF THE FLAKES
      flake.enterFromTop(this.#newFlakeHorizontalPosition);
      return;
    }

    if (Math.sin(this.#angleDegrees) > 0) { // ENTER FROM LEFT
      flake.enterFromLeft(this.#newFlakeVerticalPosition);
      return;
    }

    // ENTER FROM RIGHT
    flake.enterFromRight(this.width, this.#newFlakeVerticalPosition);
  }


  #clearTimers() {
    clearTimeout(this.reactivationTimerHandler);
    this.reactivationTimerHandler = undefined;

    clearTimeout(this.animationHandler);
    this.animationHandler = undefined;
  }


  stop() {
    this.#clearTimers();
    this.animationCompleted = true;
    return this.#canvasClearedContext.then(() => {
      return;
    }).catch(() => Promise.resolve());
  }




  




}
