"use strict";
import { AppModel } from "~/_models/app-model";
const MINIMUM_DURATION = 3;
const ROUND_MARGIN = 2;
export class SneakPeekSettings extends AppModel {

  constructor(selected, duration = null, limit = null) {
    super();
    this.selected = selected;
    if (this.selected) {
      this.duration = duration;
      this.limit = limit;
    }
  }

  get allowed() {
    return this.selected && (this.duration >= MINIMUM_DURATION);
  }

  get durationWithMargin() {
    return this.duration + ROUND_MARGIN;
  }

}
