"use strict";

import { AppModel } from "./app-model";
import { valueDefined } from "~/_utils/validator";
export class User extends AppModel {
  constructor(id, username, gameRoomId = null) {
    super();
    this.id = id;
    this.username = username;
    this.gameRoomId = gameRoomId;
  }

  // conected() {
  //   return this.id !== this.username;
  // }

  get inGame() {
    return valueDefined(this.gameRoomId);
  }

}
