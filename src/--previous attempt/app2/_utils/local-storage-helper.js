"use strict";
import { Theme } from "~/_enums/app-settings.enums";
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

  static get selectedTheme() {
    const settings =  LocalStorageHelper.appSettings;
    if (!settings || !settings.theme) {
      return Theme.Default;
    }
    return settings.theme;
  }

  static get appSettings() {
    return LocalStorageHelper.retrieve("appSettings");
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

}
