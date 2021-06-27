"use strict";
import { User } from "~/_models/user";
import { valueDefined } from "~/_utils/validator";

export class AppHelper {

  static #generateUser(userData) {
    return new User(userData.id, userData.username, userData.gameRoomId);
  }

  static updateUser(data) {
    if (!data.user) {
      return;
    }
    if (self.user) {
      self.user.update(data.user);
    } else {
      self.user = AppHelper.#generateUser(data.user);
    }
  }

  static updateUserPeers(peers) {
    if (!self.user) {
      return;
    }
    self.user.peers =  peers.map((peerData) => AppHelper.#generateUser(peerData));
  }

}
