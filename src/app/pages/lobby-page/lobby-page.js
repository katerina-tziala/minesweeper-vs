'use strict';
import './lobby-page.scss';
import { Page } from '../page';
import { LinkInvitationButton } from './link-invitation-button/link-invitation-button';
import { OnlineUsers } from './online-users/online-users';
import { DOM_ELEMENT_CLASS } from './lobby-page.constants';

import { ElementGenerator, ElementHandler, ButtonGenerator, TemplateGenerator } from 'UI_ELEMENTS';
export class LobbyPage extends Page {


  constructor() {
    super();
    this.init();

  }

  getTestPeers(inGame = false) {
    const peers = [];


    for (let index = 0; index < 5; index++) {
      const stringNumber = index.toString();

      let username = "kate" + stringNumber;

      for (let i = 0; i < index; i++) {
        username += "kate";
      }
      peers.push({ id: stringNumber, username, inGame });
    }

    return peers;
  }


  renderPage(mainContainer) {
    console.log('LobbyPage');

    const section = this.#generateMainSection();
    mainContainer.append(section);

    // setTimeout(() => {
    //   this.users = this.getTestPeers(true);
    //   this.users = this.users.concat(this.getTestPeers())
    //   this.onlineUsers.updateOnlineUsers(this.users);

    // }, 3000)
    //console.log(mainContainer);
  }


  #generateLinkInvitationSection() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.lintInvitationContainer]);
    const button = LinkInvitationButton.generate(this.#inviteWithLink.bind(this));
    container.append(button);
    return container;
  }

  #generateMainSection() {
    this.onlineUsers = new OnlineUsers(this.#onInviteUser.bind(this));
    // set initial users
    const section = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.content]);
    const linkInvitation = this.#generateLinkInvitationSection();
    const onlineUsersSection = this.onlineUsers.render();
    section.append(linkInvitation, onlineUsersSection);
    return section;
  }

  #inviteWithLink() {
    console.log('inviteWithLink');
  }

  #onInviteUser(user) {
    console.log('onInviteUser');
    console.log(user);
  }
}
