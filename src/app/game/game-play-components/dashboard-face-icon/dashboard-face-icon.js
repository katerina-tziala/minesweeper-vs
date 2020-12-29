"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./dashboard-face-icon.constants";

export class DashboardFaceIcon {
  #_gameId;

  constructor(gameId) {
    this.#gameID = gameId;
  }

  set #gameID(id) {
    this.#_gameId = id;
  }

  get #gameID() {
    return this.#_gameId;
  }

  get #iconID() {
    return DOM_ELEMENT_ID.faceIcon + this.#gameID;
  }

  get #iconElement() {
    return ElementHandler.getByID(this.#iconID);
  }


  #getIconStylesBasedOnPlayer(colorType) {
    const iconStyles = [];
    if (colorType) {
      iconStyles.push(DOM_ELEMENT_CLASS.player);
      iconStyles.push(DOM_ELEMENT_CLASS.color + colorType);
    } else {
      iconStyles.push(DOM_ELEMENT_CLASS.default);
    }
    return iconStyles;
  }

  #getIconStyles(stateStyle, colorType) {
    let iconStyles = [DOM_ELEMENT_CLASS.faceIcon];
    iconStyles.push(stateStyle);
    iconStyles = iconStyles.concat(this.#getIconStylesBasedOnPlayer(colorType));
    return iconStyles;
  }

  #setIconStyles(iconStyles) {
    return this.#iconElement.then((icon) => {
      ElementHandler.setStyleClass(icon, iconStyles)
      return;
    });
  }

  generateIcon() {
    const icon = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.faceIcon], this.#iconID);
    return icon;
  }

  setSmileFace(colorType) {
    const iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.smile, colorType);
    return this.#setIconStyles(iconStyles);
  }

  setSurpriseFace(colorType) {
    const iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.surprise, colorType);
    return this.#setIconStyles(iconStyles);
  }

  setWinnerFace(colorType) {
    const iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.winner, colorType);
    return this.#setIconStyles(iconStyles);
  }

  setLostFace(colorType) {
    const iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.lost, colorType);
    return this.#setIconStyles(iconStyles);
  }

  setRollingEyesFace(colorType) {
    const iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.rollingEyes, colorType);
    return this.#setIconStyles(iconStyles);
  }

}
