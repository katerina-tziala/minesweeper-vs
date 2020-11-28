"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { sortNumbersArrayAsc, uniqueArray, arrayDifference } from "~/_utils/utils";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, DIGIT_POSITIONS } from "./digital-counter.constants";
import { preventInteraction } from "~/_utils/utils";

export class DigitalCounter {
  #_id;

  constructor(id) {
    this.#id = id;
    this.digits = ["0", "1", "2"];
  }

  set #id(id) {
    this.#_id = id;
  }

  get #id() {
    return this.#_id;
  }

  get parentContainer() {
    return ElementHandler.getByID(this.#id);
  }

  get generateCounter() {
    const counter = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.counter]);

    for (let index = 0; index < 3; index++) {
      counter.append(this.#generateDigit(index));
    }
    // console.log(this.#id);

    return counter;
  }

  #getDigitId(digitIndex) {
    return this.#id + DOM_ELEMENT_ID.digit + digitIndex;
  }

  #generateDigit(digitIndex) {
    const digit = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.digit], this.#getDigitId(digitIndex));
    // console.log("digitIndex", digitIndex);
    // console.log("this.digits", this.digits[digitIndex]);

    for (let index = 1; index < 8; index++) {
      const digitLine = document.createElement("div");
      ElementHandler.setStyleClass(digitLine, this.getDigitLineStyleClass(index, this.digits[digitIndex]));
      digit.append(digitLine);
    }
    return digit;
  }



  getDigitLineStyleClass(digitLinePosition, digit) {
    let digitStyles = [DOM_ELEMENT_CLASS.digitLine];
    digitStyles.push(DOM_ELEMENT_CLASS.digitLine + TYPOGRAPHY.doubleHyphen + digitLinePosition);

    console.log("on should be ", digit, " :", DIGIT_POSITIONS[digit]);
    //this.digits

    return digitStyles;
  }




}
