"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";
import { sortNumbersArrayAsc, uniqueArray, arrayDifference } from "~/_utils/utils";
import { DOM_ELEMENT_CLASS } from "./face-icon.constants";
import { preventInteraction } from "~/_utils/utils";

export class FaceIcon {
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




}
