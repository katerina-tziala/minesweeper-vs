"use strict";
import { INVITE_BTN } from "~/_constants/btn-text.constants";
import { clone } from "~/_utils/utils.js";
import { valueDefined } from "~/_utils/validator";
import {
  ElementHandler,
  ElementGenerator,
} from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_CLASS,
  DOM_ELEMENT_ID,
  CONTENT,
  NO_ONLINE_USER_MESSAGE
} from "./online-users-controller.constants";
import { UserAvatar } from "~/components/user-avatar/user-avatar";

export class OnlineUsersController {
  #users = [];
  // #onSelectedUser;
  constructor() {
    console.log("OnlineUsersController");
    this.#initUsers();
    console.log(this.#users);
    // this.users = users;
    // this.#onSelectedUser = onSelectedUser;
  }

  #initUsers() {
    this.#users = self.onlineConnection.peers;
    this.#users.sort((userA, userB) => {
      return this.#sortUsersByAvailability(userA, userB) || userA.username - userB.username;
    });
  }

  #sortUsersByAvailability(userA, userB) {
    if (!valueDefined(userA.gameRoomId) || !valueDefined(userB.gameRoomId)) {
      return -1;
    }
    return 0;
  }





  generateView() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_ID.container);
    container.append(this.#renderedUsers);
    return container;
  }


  get #renderedUsers() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wrapper]);
    // if (this.#users.length) {
    //   this.#users.forEach(user => container.append(this.#generateUserCard(user)));
    // } else {
    container.append(NO_ONLINE_USER_MESSAGE);
    // }
    return container;
  }
  get #noOnlineUsersMessage() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.noUserOnline]);
    container.innerHTML = CONTENT.noUsersOnline;
    return container;
  }
  // get #container() {
  //   return ElementHandler.getByID(DOM_ELEMENT_ID.container);
  // }



  #generateUserCard(user) {
    const styles = [DOM_ELEMENT_CLASS.userCard];
    if (valueDefined(user.gameRoomId)) {
      styles.push(DOM_ELEMENT_CLASS.userCardInGame)
    }
    const userCard = ElementGenerator.generateContainer(styles);
    // userCard.append(
    //   UserAvatar.generate(),
    //   this.#generateUserName(user),
    //   this.#generateInvitationButton(user)
    // );
    return userCard;
  }

  // #generateUserName(user) {
  //   const name = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.name]);
  //   name.innerHTML = user.username;
  //   name.title = user.username;
  //   return name;
  // }

  // #generateInvitationButton(user) {
  //   const params = clone(INVITE_BTN);
  //   params.attributes["aria-label"] = params.attributes["aria-label"] + user.username;
  //   const button = ElementGenerator.generateButton(params, () => {
  //     if (this.#onSelectedUser) {
  //       this.#onSelectedUser(user);
  //     }
  //   });
  //   ElementHandler.setDisabled(button, valueDefined(user.gameRoomId));
  //   return button;
  // }



  // updateOnlineUsers(users) {
  //   this.users = users;
  //   this.#container.then(container => {
  //     ElementHandler.clearContent(container);
  //     container.append(this.#renderedUsers);
  //   });
  // }

}
