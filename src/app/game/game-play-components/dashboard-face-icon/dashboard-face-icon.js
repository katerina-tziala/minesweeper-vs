"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./dashboard-face-icon.constants";

export class DashboardFaceIcon {
  #_parentId;
  #_gameId;

  constructor(gameId, parentId) {
    this.#parentID = parentId;
    this.#gameID = gameId;
    console.log(gameId, parentId);
  }

  set #gameID(id) {
    this.#_gameId = id;
  }

  get #gameID() {
    return this.#_gameId;
  }

  set #parentID(id) {
    this.#_parentId = id;
  }

  get #parentID() {
    return this.#_parentId;
  }

  get #iconID() {
    return DOM_ELEMENT_ID.faceIcon + this.#gameID;
  }

  get #parentElement() {
    return ElementHandler.getByID(this.#parentID);
  }

  get #iconElement() {
    return ElementHandler.getByID(this.#iconID);
  }

  set #iconStyles(iconStyles) {
    this.#iconElement.then((icon) =>
      ElementHandler.setStyleClass(icon, iconStyles),
    );
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

  #generateIcon() {
   const icon = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.faceIcon], this.#iconID);
   return icon;
  }

  init() {
    return this.#parentElement.then(parentElement => {
      ElementHandler.clearContent(parentElement);
      parentElement.append(this.#generateIcon());
    });
  }

  setSmileFace(colorType) {
    this.#iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.smile, colorType);
  }

  setSurpriseFace(colorType) {
    this.#iconStyles = this.#getIconStyles(
      DOM_ELEMENT_CLASS.surprise,
      colorType,
    );
  }

  setWinnerFace(colorType) {
    this.#iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.winner, colorType);
  }

  setLostFace(colorType) {
    this.#iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.lost, colorType);
  }

  setRollingEyesFace(colorType) {
    this.#iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.rollingEyes, colorType);
  }
  
}
