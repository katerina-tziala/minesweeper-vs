"use strict";

export class AppModel {
  constructor() { }

  update(updateData) {
    if (updateData) {
      Object.keys(updateData).forEach(
        (property) => (this[property] = updateData[property]),
      );
    }
  }
}
