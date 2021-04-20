"use strict";
import { AppModel } from "~/_models/app-model";
const MINIMUM_DURATION = 3;
const ROUND_MARGIN = 1;
export class SneakPeekSettings extends AppModel {

  constructor(applied = false, duration = 0, limit = 0) {
    super();
    this.applied = applied;
    this.duration = duration;
    this.limit = limit;
  }

  get allowed() {
    return this.applied && (this.duration >= MINIMUM_DURATION);
  }

  get durationWithMargin() {
    return this.duration + ROUND_MARGIN;
  }

  get roundMargin() {
    return ROUND_MARGIN;
  }

  update(updateData) {
    super.update(updateData);
    this.updateBasedOnApplied();
  }

  updateBasedOnApplied() {
    if (!this.applied) {
      this.duration = 0;
      this.limit = 0;
    }
  }
}
