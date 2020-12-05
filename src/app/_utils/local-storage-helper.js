"use strict";

export class LocalStorageHelper {

  static save(keyName, value) {
    localStorage.setItem(keyName, JSON.stringify(value));
  }

  static retrieve(keyName) {
    const item = localStorage.getItem(keyName);
    return item ? JSON.parse(item) : undefined;
  }

  static remove(keyName) {
    return localStorage.removeItem(keyName);
  }

  static clear() {
    return localStorage.clear();
  }

  static set appSettings(data) {
    LocalStorageHelper.save("appSettings", data);
  }

  static get appSettings() {
    return LocalStorageHelper.retrieve("appSettings");
  }

  static getGameSetUp(type) {
    return LocalStorageHelper.retrieve(`gameSetup-${type}`);
  }

  static removeGameSetUp(type) {
    return localStorage.removeItem(`gameSetup-${type}`);
  }

  static setGameSetUp(type, data) {
    LocalStorageHelper.save(`gameSetup-${type}`, data);
  }

  static getGameSetUp(type) {
    return LocalStorageHelper.retrieve(`gameSetup-${type}`);
  }

  static removeGameSetUp(type) {
    return localStorage.removeItem(`gameSetup-${type}`);
  }

}

