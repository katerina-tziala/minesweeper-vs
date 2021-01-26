"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";


import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, DIAMETER_RANGE, TILT_STEP } from "./confetti-particle.constants";

export class ConfettiParticle {
  #lineWidth = 0;
  #color = "red";


  constructor(color, xCoordinate, yCoordinate, density) {
    this.#color = color;

    this.angleIncremental = (Math.random() * 0.07) + .05;

    this.angle = 0;

    this.xCoordinate = -DIAMETER_RANGE.max;
    this.yCoordinate = -DIAMETER_RANGE.max;

    this.density = density;


    this.setPosition(xCoordinate, yCoordinate);
    this.#setRadiusProperties();






  }

  #getVerticalStep(angleDegrees = 0) {
    return (Math.cos(angleDegrees + this.density) + this.radius) / 2;
  }

  #getHorizontalStep(angleDegrees = 0) {
    return Math.sin(angleDegrees);
  }

  #generateDiameter() {
    return Math.floor(Math.random() * (DIAMETER_RANGE.min - DIAMETER_RANGE.max + 1) + DIAMETER_RANGE.max);
  }

  #setRadiusProperties() {
    this.diameter = this.#generateDiameter();
    this.radius = this.diameter / 2;
    this.#lineWidth = Math.floor(this.diameter / 3);
  }

  setPosition(xCoordinate, yCoordinate) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.#initTilt();
  }


  #initTilt() {
    this.angle = 0;
    this.tilt = Math.floor(Math.random() * DIAMETER_RANGE.min) - DIAMETER_RANGE.max;
  }

  #incrementTilt() {
    this.angle += this.angleIncremental;
    this.tilt = Math.sin(this.angle) * TILT_STEP;
  }

  updatePositionBasedOnAngle(angleDegrees) {
    this.#incrementTilt();
    this.xCoordinate += this.#getHorizontalStep(angleDegrees);
    this.yCoordinate += this.#getVerticalStep(angleDegrees);
  }

  isOnTopOfCanvas() {
    return this.yCoordinate < -DIAMETER_RANGE.max;
  }


  isDropped(canvasHeight) {
    return this.yCoordinate - DIAMETER_RANGE.max > canvasHeight;
  }

  outOfCanvas(canvasWidth, canvasHeight) {
    const outsideLeftSide = this.xCoordinate < -DIAMETER_RANGE.max;
    const outsideRightSide = this.xCoordinate > canvasWidth + DIAMETER_RANGE.max;
    return outsideLeftSide || outsideRightSide || this.isDropped(canvasHeight);
  }

  enterFromLeft(yCoordinate = this.yCoordinate) {
    this.setPosition(-DIAMETER_RANGE.max, yCoordinate);
  }

  enterFromRight(canvasWidth, yCoordinate = this.yCoordinate) {
    this.setPosition(canvasWidth + DIAMETER_RANGE.max, yCoordinate);
  }

  enterFromTop(xCoordinate = this.xCoordinate) {
    this.setPosition(xCoordinate, -DIAMETER_RANGE.min);
  }

  setDroppedPosition(canvasHeight) {
    this.xCoordinate = canvasHeight + DIAMETER_RANGE.max;
  }




  





  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = this.#lineWidth;

    ctx.strokeStyle = this.#color;

    const pointerStart = this.xCoordinate + this.tilt;


    ctx.moveTo(pointerStart + (this.diameter / 4), this.yCoordinate);

    ctx.lineTo(pointerStart, this.yCoordinate + this.tilt + (this.diameter / 4));

    //pass shadow color
    // ctx.shadowColor = "rgba(0,0,0, .6)";
    // ctx.shadowOffsetX = 0; 
    // ctx.shadowOffsetY = 0;

    // ctx.stroke();
    // ctx.fill();

    // // clear the shadow
    // ctx.shadowColor = 0;
    // ctx.shadowOffsetX = 0; 
    // ctx.shadowOffsetY = 0;
    // ctx.shadowBlur = 1;
    // restroke without the shaodw
    ctx.stroke();

    return;
  }





}
