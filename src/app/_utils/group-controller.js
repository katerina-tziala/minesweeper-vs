"use strict";

export class GroupController {
  #_controllers = new Map;

  constructor() { }

  set controllers(controller) {
    this.removeController(controller.name);
    this.#_controllers.set(controller.name, controller);
  }

  get controllers() {
    return Array.from(this.#_controllers.values());
  }

  getController(key) {
    return this.#_controllers.get(key);
  }

  removeController(key) {
    if (this.#_controllers.has(key)) {
      this.#_controllers.delete(key);
    }
  }

}
