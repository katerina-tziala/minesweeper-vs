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
  CONTENT
} from "./online-users.constants";
import { UserAvatar } from "~/components/user-avatar/user-avatar";

export class OnlineUsers {
  #users = [];

  constructor(users = []) {
    this.users = users;


    console.log(this.#users);
  }

  set users(users) {
    users.sort((userA, userB) => {
      return this.#sortUsersByAvailability(userA, userB) || userA.id - userB.id;
    });
    this.#users = users;
  }

  #sortUsersByAvailability(userA, userB) {
    if (!valueDefined(userA.gameRoomId) || !valueDefined(userB.gameRoomId)) {
      return -1;
    }
    return 0;
  }

  get #renderedUsers() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wrapper]);
    if (this.#users.length) {
      this.#users.forEach(user => container.append(this.#generateUserCard(user)));
    } else {
      container.append(this.#noOnlineUsersMessage);
    }
    return container;
  }

  get #container() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container);
  }

  get #noOnlineUsersMessage() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.noUserOnline]);
    container.innerHTML = CONTENT.noUsersOnline;
    return container;
  }

  #generateUserCard(user) {
    const styles = [DOM_ELEMENT_CLASS.userCard];
    if (valueDefined(user.gameRoomId)) {
      styles.push(DOM_ELEMENT_CLASS.userCardInGame)
    }
    const userCard = ElementGenerator.generateContainer(styles);
    userCard.append(
      UserAvatar.generate(),
      this.#generateUserName(user),
      this.#generateInvitationButton(user)
    );
    return userCard;
  }

  #generateUserName(user) {
    const name = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.name]);
    name.innerHTML = user.username;
    name.title = user.username;
    return name;
  }

  #generateInvitationButton(user) {
    const params = clone(INVITE_BTN);
    params.attributes["aria-label"] = params.attributes["aria-label"] + user.username;
    const button = ElementGenerator.generateButton(params, () => {
      console.log("inv");
    });
    ElementHandler.setDisabled(button, valueDefined(user.gameRoomId));
    return button;
  }

  generateView() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_ID.container);
    container.append(this.#renderedUsers);
    return container;
  }

  updateOnlineUsers(users) {
    this.users = users;
    this.#container.then(container => {
      ElementHandler.clearContent(container);
      container.append(this.#renderedUsers);
    });
  }

}
