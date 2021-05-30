'use strict';
import { ElementGenerator, ElementHandler, ButtonGenerator, TemplateGenerator } from 'UI_ELEMENTS';

import { DOM_ELEMENT_CLASS, CONTENT } from './online-users.constants';

export class OnlineUsers {
  // #id = 'minesweeperUser';
  // #username;
  // #inGame 

  constructor() {
    console.log('OnlineUsers');
    this.users = [];
   // this.users = this.getTestPeers();

  }

  getTestPeers(inGame = false) {
    const peers = [];
  
    
    for (let index = 0; index < 20; index++) {
      const stringNumber = index.toString();
      
      let username = "kate" + stringNumber;

      for (let i = 0; i < index; i++) {
        username += "kate";
      }
      peers.push({id: stringNumber, username, inGame});
    }

    return peers;
  }


  get #content() {
    if (this.users.length) {
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

    
    this.users.forEach(user => {
      const card = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.onlineUser]);
      const avatar = document.createElement('app-avatar');
      const username = document.createElement('p');
      username.innerHTML = user.username;

      const button = ButtonGenerator.generateTextButton('invite', () => {
        console.log('invite clicked');
      })
      console.log(user);

      card.append(avatar, username, button);
      fragment.append(card);
      
    })

    return fragment;
  }

  render() {
    const section = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.section]);
    const header = ElementGenerator.generateTitleH2([CONTENT.header]);
    const contentContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.content], DOM_ELEMENT_CLASS.content);
    contentContainer.append(this.#content);
    section.append(header, contentContainer);
    return section;
  }



}
