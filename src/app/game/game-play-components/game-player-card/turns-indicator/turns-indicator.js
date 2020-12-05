"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./turns-indicator.constants";

export class TurnsIndicator {

  static getTurnsIndicatorID(player) {
    return DOM_ELEMENT_ID.container + player.id;
  }

  static generate(player, allowedTurns = 10) {
    const turns = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container]);
    ElementHandler.setID(turns, TurnsIndicator.getTurnsIndicatorID(player));
    for (let index = 1; index <= allowedTurns; index++) {
      const styles = TurnsIndicator.getIndicatorStyles(player, index, allowedTurns);
      const turnIndicator = ElementGenerator.generateContainer(styles);
      turns.append(turnIndicator);
    }
    return turns;
  }

  static getIndicatorBaseStyles(position) {
    const styles = [DOM_ELEMENT_CLASS.indicator];
    const positionStyle = DOM_ELEMENT_CLASS.indicator + TYPOGRAPHY.doubleHyphen + position;
    styles.push(positionStyle);
    return styles;
  }

  static getIndicatorStyles(player, indicatorPosition, allowedTurns = 10) {
    const styles = TurnsIndicator.getIndicatorBaseStyles(indicatorPosition);
    const onLimit = player.getTurnsLeft(allowedTurns);
    (indicatorPosition <= onLimit) ? styles.push(DOM_ELEMENT_CLASS.indicatorOn) : styles.push(DOM_ELEMENT_CLASS.indicatorOff);
    return styles;
  }

}
