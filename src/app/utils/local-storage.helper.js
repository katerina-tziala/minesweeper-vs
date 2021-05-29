'use strict';

export class LocalStorageHelper {
  //state controoler
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

  static saveUsername(username) {
    return LocalStorageHelper.save('username', username);
  }

  static deleteUsername() {
    return LocalStorageHelper.remove('username');
  }

  // static savePeers(peers) {
  //   return LocalStorageHelper.save('peers', peers);
  // }

  static get username() {
    return LocalStorageHelper.retrieve('username');
  }

  static saveGameSetUp(type, data) {
    LocalStorageHelper.save(`game-setup-${type}`, data);
  }

  static getGameSetUp(type) {
    return LocalStorageHelper.retrieve(`game-setup-${type}`);
  }

  static deleteGameSetUp(type) {
    return LocalStorageHelper.remove(`game-setup-${type}`);
  }

  // static set appSettings(data) {
  //   LocalStorageHelper.save('appSettings', data);
  // }

  // static get selectedTheme() {
  //   const settings =  LocalStorageHelper.appSettings;
  //   if (!settings || !settings.theme) {
  //     return Theme.Default;
  //   }
  //   return settings.theme;
  // }

  // static get appSettings() {
  //   return LocalStorageHelper.retrieve('appSettings');
  // }

  // static removeGameSetUp(type) {
  //   return localStorage.removeItem(`gameSetup-${type}`);
  // }



}
