"use strict";
import { clone } from "~/_utils/utils.js";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { SneakPeekSettings } from "GameModels";



export class SneakPeekController  {

  constructor(roundBased = false) {

    this.roundBased = roundBased;
    this.config = new SneakPeekSettings();
    console.log("SneakPeekController");

    this.config.allowed = true;
    this.config.duration = 3;
    console.log(this);
  
    
  }

  get hijackTimer() {
    return !this.roundBased;
  }


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
  










}
