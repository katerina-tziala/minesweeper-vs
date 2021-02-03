"use strict";

import { AppModel } from "./app-model";

export class User extends AppModel {
  constructor(id, username, gameRoomId = null) {
    super();
    this.id = id;
    this.username = username;
    this.gameRoomId = gameRoomId;
  }

  conected() {
    return this.id !== this.username;
  }

}
