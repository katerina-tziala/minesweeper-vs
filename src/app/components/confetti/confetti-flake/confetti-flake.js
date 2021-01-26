"use strict";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { randomFromRange } from "~/_utils/utils";
import { CONFIG, COLORS, SHADOW_COLORS } from "./confetti-flake.constants";

export class ConfettiFlake {
  #x = 0;
  #y = 0;
  #density = 0;
  #angleIncremental = 0;
  #angle = 0;
  #radius = 0;
  #diameter = 0;
  #tilt = 0;
  #lineWidth = 0;
  #colorType;

  constructor(x, y, density, colorType) {
    this.#init();
    this.#colorType = colorType;
    this.#density = density;
    this.setPosition(x, y);
  }

  get #pointerIncrement() {
    return Math.round(this.#diameter / CONFIG.pointerIncrement);
  }

  get #drawPosition() {
    const pointerStart = this.#x + this.#tilt;
    const verticalStart = this.#y;
    const verticalEnd = this.#y + this.#tilt + this.#pointerIncrement;
    const horizontalStart = pointerStart + this.#pointerIncrement;
    const horizontaEnd = pointerStart;
    return { verticalStart, verticalEnd, horizontalStart, horizontaEnd };
  }

  get #theme() {
    return LocalStorageHelper.selectedTheme;
  }

  get #shadowColor() {
    return SHADOW_COLORS[this.#theme];
  }

  get #color() {
    return COLORS[this.#theme][this.#colorType];
  }

  get onTopOfCanvas() {
    return this.#y < - CONFIG.maxSize;
  }

  #init() {
    this.#diameter = randomFromRange(CONFIG.minSize, CONFIG.maxSize);
    this.#radius = this.#diameter / 2;
    this.#lineWidth = Math.floor(this.#diameter / CONFIG.lineWeight);
    this.#angleIncremental = (Math.random() * CONFIG.angleIncrementWeight) + CONFIG.angleIncrementWeight;
    this.#initTilt();
  }

  #initTilt() {
    this.#angle = 0;
    this.#tilt = Math.floor(Math.random() * CONFIG.minSize) - CONFIG.maxSize;
  }

  #incrementTilt() {
    this.#angle += this.#angleIncremental;
    this.#tilt = Math.sin(this.#angle) * CONFIG.tiltStep;
  }

  #getVerticalStep(angleDegrees = 0) {
    angleDegrees += this.#density;
    return (Math.cos(angleDegrees) + this.#radius) / 2;
  }

  #getHorizontalStep(angleDegrees = 0) {
    return Math.sin(angleDegrees);
  }

  updateBasedOnAngle(angleDegrees) {
    this.#incrementTilt();
    this.#x += this.#getHorizontalStep(angleDegrees);
    this.#y += this.#getVerticalStep(angleDegrees);
  }

  setPosition(x = 0, y = 0) {
    this.#x = x;
    this.#y = y;
    this.#initTilt();
  }

  enterFromLeft(y = this.#y) {
    const newX = - CONFIG.maxSize;
    this.setPosition(newX, y);
  }

  enterFromRight(canvasWidth, y = this.#y) {
    const newX = canvasWidth + CONFIG.maxSize;
    this.setPosition(newX, y);
  }

  enterFromTop(x = this.#x) {
    const newY = - CONFIG.minSize;
    this.setPosition(x, newY);
  }

  setDroppedPosition(canvasHeight) {
    this.#y = canvasHeight + CONFIG.maxSize;
  }

  isDropped(canvasHeight) {
    return this.#y - CONFIG.maxSize > canvasHeight;
  }

  outOfCanvas(canvasWidth, canvasHeight) {
    const outsideLeftSide = this.#x < - CONFIG.maxSize;
    const outsideRightSide = this.#x > canvasWidth + CONFIG.maxSize;
    return outsideLeftSide || outsideRightSide || this.isDropped(canvasHeight);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = this.#lineWidth;
    ctx.strokeStyle = this.#color;
    const drawPosition = this.#drawPosition;
    ctx.moveTo(drawPosition.horizontalStart, drawPosition.verticalStart);
    ctx.lineTo(drawPosition.horizontaEnd, drawPosition.verticalEnd);
    this.#drawShadow(ctx);
    ctx.stroke();
    return;
  }

  #drawShadow(ctx) {
    ctx.shadowColor = this.#shadowColor;
    ctx.shadowOffsetX = CONFIG.shadowOffsetX;
    ctx.shadowOffsetY = CONFIG.shadowOffsetY;
    ctx.stroke();
    ctx.fill();
    ctx.shadowColor = CONFIG.shadowColor;
    ctx.shadowOffsetX = CONFIG.shadowOffsetX;
    ctx.shadowOffsetY = CONFIG.shadowOffsetY;
    ctx.shadowBlur = CONFIG.shadowBlur;
  }

}
