"use strict";

export class GroupController {
  #_controllers = {};

  constructor() { }

  set controllers(controller) {
    delete this.#_controllers[controller.name];
    this.#_controllers[controller.name] = controller;
  }

  get controllers() {
    return Object.values(this.#_controllers);
  }

  getController(key) {
    return this.#_controllers[key];
  }

}
