"use strict";
import { AppModel } from "~/_models/app-model";
const MINIMUM_DURATION = 3;
export class SneakPeekSettings extends AppModel {

  constructor() {
    super();
    this.selected = false;
    this.duration = null;
    this.limit = null;
  }

  get allowed() {
    return this.selected && (this.duration >= MINIMUM_DURATION);
  }

}
