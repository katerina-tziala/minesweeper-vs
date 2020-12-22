"use strict";

import { ElementHandler } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS } from "./dashboard-face-icon.constants";

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
    let iconStyles = [DOM_ELEMENT_CLASS.dashboardIcon];
    iconStyles.push(stateStyle);
    iconStyles = iconStyles.concat(this.#getIconStylesBasedOnPlayer(colorType));
    return iconStyles;
  }

  init() {
    this.#iconStyles = [DOM_ELEMENT_CLASS.dashboardIcon];
    return Promise.resolve();
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
