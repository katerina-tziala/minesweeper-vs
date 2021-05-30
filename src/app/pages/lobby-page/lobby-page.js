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

  renderPage(mainContainer) {
    console.log('LobbyPage');

    const section = this.#generateMainSection();
    mainContainer.append(section);

    console.log(mainContainer);
  }


  #generateLinkInvitationSection() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.lintInvitationContainer]);
    const button = LinkInvitationButton.generate(this.#inviteWithLink.bind(this));
    container.append(button);
    return container;
  }

  #generateMainSection() {
    this.onlineUsers = new OnlineUsers();
    const section = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.content]);
    const linkInvitation = this.#generateLinkInvitationSection();
    const onlineUsersSection = this.onlineUsers.render();
    section.append(linkInvitation, onlineUsersSection);
    return section;
  }

  #inviteWithLink() {
    console.log('inviteWithLink');
  }

}
