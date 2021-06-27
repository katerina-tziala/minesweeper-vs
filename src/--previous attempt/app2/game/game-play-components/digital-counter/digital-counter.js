"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { valueDefined } from "~/_utils/validator";
import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  LIMITS,
  SPECIAL_DIGIT_VALUE,
  DEFAULT_DIGITS,
} from "./digital-counter.constants";
import { Digit } from "./digit/digit";

export class DigitalCounter {
  #_id;
  #_value;
  #_digits;

  constructor(id) {
    this.#id = id;
    this.#digits = [];
    this.value = undefined;
    this.#init();
  }

  set #id(id) {
    this.#_id = id;
  }

  get #id() {
    return this.#_id;
  }

  set #digits(digits) {
    this.#_digits = digits;
  }

  get #digits() {
    return this.#_digits;
  }

  get #digitalCounterContainer() {
    return ElementHandler.getByID(this.#id);
  }

  #getDigitId(digitIndex) {
    return this.#id + DOM_ELEMENT_ID.digit + digitIndex;
  }

  #init() {
    const digits = [];
    for (let index = 0; index < 3; index++) {
      digits.push(new Digit(this.#getDigitId(index)));
    }
    this.#digits = digits;
  }

  #setDigitsValues() {
    if (this.#digits.length) {
      const digitsValues = this.#valueArray;
      this.#digits.forEach((digit, index) => {
        digit.update(digitsValues[index]);
      });
    }
  }

  get #exceedsUpperLimit() {
    return this.value && this.value > LIMITS.max;
  }

  get #exceedsLowerLimit() {
    return this.value && this.value < LIMITS.min;
  }

  get #valueArray() {
    if (!valueDefined(this.value)) {
      return DEFAULT_DIGITS.undefined;
    }
    if (this.#exceedsUpperLimit) {
      return DEFAULT_DIGITS.exceedsUpper;
    }
    if (this.#exceedsLowerLimit) {
      return DEFAULT_DIGITS.exceedsLower;
    }
    return this.#valueArrayWhenNumber;
  }

  get #valueArrayWhenNumber() {
    let digitsArray = Math.abs(this.value)
      .toString()
      .split(TYPOGRAPHY.emptyString);
    while (digitsArray.length < 3) {
      digitsArray.unshift(SPECIAL_DIGIT_VALUE.zero);
    }
    if (this.value < 0) {
      digitsArray[0] = SPECIAL_DIGIT_VALUE.minus;
    }
    return digitsArray;
  }

  set value(value) {
    this.#_value = value;
  }

  get value() {
    return this.#_value;
  }

  updateValue(value) {
    this.value = value;
    this.#setDigitsValues();
  }

  generate() {
    return this.#digitalCounterContainer.then((digitalCounter) => {
      ElementHandler.clearContent(digitalCounter);
      digitalCounter.append(this.#generateCounter);
      return;
    });
  }

  get #generateCounter() {
    const counter = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.counter,
    ]);
    this.#digits.forEach((digit) => counter.append(digit.generateDigit()));
    return counter;
  }
}
