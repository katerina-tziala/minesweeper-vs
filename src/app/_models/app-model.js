'use strict';

export class AppModel {
  constructor() { }

  update(updateData) {
    if (updateData) {
      this.#updateProperties(updateData);
    }
  }

  #updateProperties(updateData) {
    Object.keys(updateData).forEach(property => (this[property] = updateData[property]));
  }
}
