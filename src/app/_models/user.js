"use strict";

import { AppModel } from "./_app-model";


export class User extends AppModel {

	constructor(id, username, gameRoomId) {
		super();
        this.id = id;
        this.username = username;
        this.gameRoomId = gameRoomId;
	}




}
