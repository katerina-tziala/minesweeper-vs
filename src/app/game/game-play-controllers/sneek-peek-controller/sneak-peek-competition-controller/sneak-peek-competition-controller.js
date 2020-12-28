"use strict";
import { nowTimestamp } from "~/_utils/dates";
import { SneakPeekSettings } from "GameModels";

import { SneakPeekTimerController } from "../sneak-peek-timer-controller";
import { SneakPeekButton } from "GamePlayComponents";

const ROUND_MARGIN = 2;

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { SneakPeekController } from "../sneak-peek-controller";

import { DOM_ELEMENT_CLASS } from "./sneak-peek-competition-controller.constants";


export class SneakPeekCompetitionController extends SneakPeekController {

  constructor(onSneakPeek, onSneakPeekEnd, allowedByStrategy) {
    super(onSneakPeek, onSneakPeekEnd, allowedByStrategy, false);
    this.timerControllerParentID = this.#layerID;

    console.log(this);
  }

  get #layerID() {
    return DOM_ELEMENT_CLASS.sneakPeekLayer;
  }

  get sneakPeekAllowed() {
    if (!this.allowed || !this.player) {
      return false;
    }

    return this.sneakPeekAllowedForPlayer;
  }

  get generatedSneakPeekLayer() {
    const layer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.sneakPeekLayer], this.#layerID);
    ElementHandler.hide(layer);
    return layer;
  }

  setControllerPlayer(player) {
    this.player = player;
    return this.updateToggleState();
  }

  updateToggleState() {
    return this.updatePeekToggle(!this.sneakPeekAllowed, this.player.colorType, this.playerSneakPeeksLimit);
  }

  playerPeeking() {
    return super.playerPeeking(this.player.colorType, this.player.colorType);
  }

  stopPeeking() {
    return this.stopPeekingCountDown().then(() => this.updateToggleState());
  }

}
