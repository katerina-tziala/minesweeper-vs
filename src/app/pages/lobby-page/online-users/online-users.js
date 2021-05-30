'use strict';
import { ElementGenerator, ElementHandler, ButtonGenerator } from 'UI_ELEMENTS';
import { DOM_ELEMENT_CLASS, CONTENT } from './online-users.constants';

export class OnlineUsers {
  #onSelectUser;
  #users = [];

  constructor(onSelectUser) {
    this.#onSelectUser = onSelectUser;
  }

  set users(users = []) {
    this.#users = users.sort((userA, userB) => userA.inGame - userB.inGame);
  }

  get #content() {
    if (this.#users.length) {
      return this.#onlineUsersList;
    }
    return this.#noOnlineUsersMessage;
  }

  get #noOnlineUsersMessage() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.noUserOnline]);
    container.innerHTML = CONTENT.noUsersOnline;
    return container;
  }

  get #onlineUsersList() {
    const fragment = document.createDocumentFragment();

    this.#users.forEach(user => {
      const userCard = this.#createOnlineUserCard(user);
      fragment.append(userCard);
    });

    return fragment;
  }

  #createOnlineUserCard(user) {
    const card = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.onlineUser]);
    if (user.inGame) {
      ElementHandler.addStyleClass(card, DOM_ELEMENT_CLASS.onlineUserInGame);
    }

    const avatar = document.createElement('app-avatar');
    const username = document.createElement('p');
    username.innerHTML = user.username;

    const button = ButtonGenerator.generateTextButton('invite', () => {
      if (this.#onSelectUser) {
        this.#onSelectUser(user);
      }
    });
    ElementHandler.setDisabled(button, user.inGame);

    card.append(avatar, username, button);
    return card;
  }


  render() {
    const section = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.section]);
    const header = ElementGenerator.generateTitleH2([CONTENT.header]);
    const contentContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.content], DOM_ELEMENT_CLASS.content);
    contentContainer.append(this.#content);
    section.append(header, contentContainer);
    return section;
  }

  updateOnlineUsers(users) {
    this.#users = users;
    const contentContainer = document.getElementById(DOM_ELEMENT_CLASS.content);
    if (contentContainer) {
      ElementHandler.clearContent(contentContainer);
      contentContainer.append(this.#content);
    }
  }

}
