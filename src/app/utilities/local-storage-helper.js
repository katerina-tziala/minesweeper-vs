'use strict';

export class LocalStorageHelper {

  static save(keyName, value) {
    localStorage.setItem(keyName, JSON.stringify(value));
  }

  static retrieve(keyName) {
    return localStorage.getItem(keyName);
  }

  static remove(keyName) {
    return localStorage.removeItem(keyName);
  }

  static clear() {
    return localStorage.clear();
  }

}

