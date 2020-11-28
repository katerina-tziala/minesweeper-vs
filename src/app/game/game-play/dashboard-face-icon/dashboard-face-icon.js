"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { sortNumbersArrayAsc, uniqueArray, arrayDifference } from "~/_utils/utils";
import { DOM_ELEMENT_CLASS } from "./dashboard-face-icon.constants";
import { preventInteraction } from "~/_utils/utils";

export class DashboardFaceIcon {
  #_id;

  constructor(id) {
    this.#id = id;
  }

  set #id(id) {
    this.#_id = id;
  }

  get #id() {
    return this.#_id;
  }

  get #iconElement() {
    return ElementHandler.getByID(this.#id);
  }

  set #iconStyles(iconStyles) {
    this.#iconElement.then(icon => ElementHandler.setStyleClass(icon, iconStyles));
  }

  #getIconStylesBasedOnPlayer(colorType) {
    const iconStyles = [];
    if (colorType) {
      iconStyles.push(DOM_ELEMENT_CLASS.player);
      iconStyles.push(DOM_ELEMENT_CLASS.color + colorType);
    }
    return iconStyles;
  }

  #getIconStyles(stateStyle, colorType) {
    let iconStyles = [DOM_ELEMENT_CLASS.dashboardIcon];
    iconStyles.push(stateStyle);
    iconStyles = iconStyles.concat(this.#getIconStylesBasedOnPlayer(colorType));
    return iconStyles;
  }

  setSmileFace(colorType) {
    this.#iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.smile, colorType);
  }

  setSurpriseFace(colorType) {
    this.#iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.surprise, colorType);
  }

  setWinnerFace(colorType) {
    this.#iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.winner, colorType);
  }

  setLostFace(colorType) {
    this.#iconStyles = this.#getIconStyles(DOM_ELEMENT_CLASS.lost, colorType);
  }

}
