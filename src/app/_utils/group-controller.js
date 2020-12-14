"use strict";
import { MapController } from "./map-controller";

export class GroupController {
  #_controllers = new MapController();

  constructor() {}

  set controllers(controller) {
    this.#_controllers.addInMap(controller.name, controller);
  }

  get controllers() {
    return this.#_controllers.itemsArray;
  }

  getController(key) {
    return this.#_controllers.getMapItem(key);
  }

  removeController(key) {
    this.#_controllers.removeFromMap(key);
  }
}
