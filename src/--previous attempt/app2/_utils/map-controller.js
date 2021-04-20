"use strict";

export class MapController {
  #_map = new Map();

  constructor() {}

  get itemsArray() {
    return Array.from(this.#_map.values());
  }

  getMapItem(key) {
    return this.#_map.get(key);
  }

  addInMap(name, item) {
    this.removeFromMap(name);
    this.#_map.set(name, item);
  }

  removeFromMap(key) {
    if (this.#_map.has(key)) {
      this.#_map.delete(key);
    }
  }
}
