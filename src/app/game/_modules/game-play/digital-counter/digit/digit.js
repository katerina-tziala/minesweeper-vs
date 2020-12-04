"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS, DIGIT_POSITIONS } from "./digit.constants";

export class Digit {
  #_id;
  #_value;

  constructor(id) {
    this.#id = id;
    this.#value = undefined;
  }

  set #id(id) {
    this.#_id = id;
  }

  get #id() {
    return this.#_id;
  }

  set #value(value) {
    this.#_value = value;
  }

  get #value() {
    return this.#_value;
  }

  get #linePositions() {
    return this.#value ? DIGIT_POSITIONS[this.#value] : DIGIT_POSITIONS.undefined;
  }

  get #generateDigitLines() {
    const fragment = document.createDocumentFragment();
    for (let index = 1; index < 8; index++) {
      const digitLine = document.createElement("div");
      ElementHandler.setStyleClass(digitLine, this.#getDigitLineStyles(index));
      fragment.append(digitLine);
    }
    return fragment;
  }

  #getDigitLineStyles(linePosition) {
    let digitStyles = [DOM_ELEMENT_CLASS.digitLine];
    digitStyles.push(DOM_ELEMENT_CLASS.digitLine + TYPOGRAPHY.doubleHyphen + linePosition);
    if (this.#linePositions.includes(linePosition)) {
      digitStyles.push(DOM_ELEMENT_CLASS.digitLineOn);
    }
    return digitStyles;
  }

  get #digitLines() {
    return ElementHandler.getByID(this.#id).then(digit => {
      return digit.childNodes;
    });
  }

  #updateDigitLines(digitLines) {
    digitLines.forEach((digitLine, index) => {
      ElementHandler.setStyleClass(digitLine, this.#getDigitLineStyles(index + 1));
    });
  }

  generateDigit() {
    const digit = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.digit], this.#id);
    digit.append(this.#generateDigitLines);
    return digit;
  }

  update(value) {
    this.#value = value;
    this.#digitLines.then(digitLines => this.#updateDigitLines(digitLines));
  }

}
