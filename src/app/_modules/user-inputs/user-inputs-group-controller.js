"use strict";

import { GroupController } from "~/_utils/group-controller";

export class UserInputsGroupController extends GroupController {

  constructor() {
    super();
  }

  get isValid() {
    return this.controllers.every(inputController => inputController.valid);
  }

  get inputData() {
    if (this.isValid) {
      const data = {};
      this.controllers.forEach(input => data[input.name] = input.value);
      return data;
    }
    return undefined;
  }

}
