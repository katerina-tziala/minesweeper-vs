"use strict";
import { AppModel } from "~/_models/app-model";

export class SneakPeekSettings extends AppModel {

  constructor() {
    super();
    this.allowed = false;
    this.duration = null;
    this.limit = null;
  }

}
