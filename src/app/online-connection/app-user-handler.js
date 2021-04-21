"use strict";
import { User } from "~/_models/user";
import { valueDefined } from "~/_utils/validator";

export class AppUserHandler {

  static #generateUser(userData) {
    return new User(userData.id, userData.username, userData.gameRoomId);
  }

  static updateUser(data) {
    if (!data.user) {
      return;
    }
    delete data.properties;
    if (self.user) {
      self.user.update(data.user);
    } else {
      self.user = AppUserHandler.#generateUser(data.user);
    }
  }

  static updateUserPeers(peers) {
    if (!self.user) {
      return;
    }
    self.user.peers =  peers.map((peerData) => AppUserHandler.#generateUser(peerData));
  }






}
