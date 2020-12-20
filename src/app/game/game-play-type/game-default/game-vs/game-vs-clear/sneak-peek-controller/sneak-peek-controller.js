"use strict";
import { clone } from "~/_utils/utils.js";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { SneakPeekSettings } from "GameModels";

//game play contro
import { GameInterval } from "../../../../../game-play-controllers/game-interval/game-interval";

import { SneakPeekCounter } from "../../../../../game-play-components/sneak-peek-counter/sneak-peek-counter";

//board freezer
export class SneakPeekController extends GameInterval {
  constructor(roundBased = false) {
    super();

    this.roundBased = roundBased;
    this.config = new SneakPeekSettings();

    this.config.allowed = true;
    this.config.duration = 3;

    this.limit = 0;
    this.step = -1;
    this.initialValue = this.config.duration;
    this.colorType = undefined;

    console.log("SneakPeekController");

    console.log(this);
  }

  onInit() {
    SneakPeekCounter.updateValue(this.value, this.colorType);
  }

  onUpdate() {
    SneakPeekCounter.updateValue(this.value, this.colorType);
  }

  // get hijackTimer() {
  //   return !this.roundBased;
  // }

  sneakPeekAllowed(player) {
    if (!this.config.allowed) {
      return false;
    }
    if (!this.roundBased && player.hasStrategy) {
      return true;
    }

    console.log("check based on timer when player has strategy");

    return false;
  }

  setCountdown(parentElementID, colorType) {
    this.colorType = colorType;
    ElementHandler.getByID(parentElementID).then((parentElement) => {
      parentElement.append(SneakPeekCounter.generate);
      console.log(parentElement);
      this.start();
    });
    console.log("setCountdown");

    console.log(parentElementID);
  }

 
  
  
  
  






}
