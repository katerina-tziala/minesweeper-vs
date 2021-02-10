"use strict";
import { valueDefined } from "~/_utils/validator";
import {
  ElementHandler,
  ElementGenerator,
} from "HTML_DOM_Manager";
import {
  DOM_ELEMENT_CLASS,
  DOM_ELEMENT_ID,
  CONTENT
} from "./online-users-controller.constants";
import { OnlineUserCard } from "./online-user-card/online-user-card";

export class OnlineUsersController {
  #users = [];
  #onUserSelected;

  constructor(onUserSelected) {
    this.#onUserSelected = onUserSelected;
  }

  set users(users) {
    this.#users = users;
    this.#users.sort((userA, userB) => {
      return this.#sortUsersByAvailability(userA, userB) || userA.username - userB.username;
    });
  }

  get #noOnlineUsersMessage() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.noUserOnline]);
    container.innerHTML = CONTENT.noUsersOnline;
    return container;
  }
  get #header() {
    const container = document.createElement("h2");
    ElementHandler.addStyleClass(container, DOM_ELEMENT_CLASS.header)
    container.innerHTML = CONTENT.header;
    return container;
  }

  get #renderedContent() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.#header);
    fragment.append(this.#renderedUsers);
    return fragment;
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

  #sortUsersByAvailability(userA, userB) {
    if (!valueDefined(userA.gameRoomId) || !valueDefined(userB.gameRoomId)) {
      return -1;
    }
    return 0;
  }

  #generateUserCard(user) {
    return OnlineUserCard.generateView(user, this.#onUserSelected);
  }

  generateView() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_ID.container);
    container.append(this.#renderedContent);
    return container;
  }

  updateOnlineUsers(users) {
    this.users = users;
    this.#container.then(container => {
      ElementHandler.clearContent(container);
      container.append(this.#renderedContent);
    });
  }

}
