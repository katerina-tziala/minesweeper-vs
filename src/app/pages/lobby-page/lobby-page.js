'use strict';
import './lobby-page.scss';
import { Page } from '../page';
import { PageType } from '../page-type.enum';
import { LinkInvitationButton } from './link-invitation-button/link-invitation-button';
import { OnlineUsers } from './online-users/online-users';
import { DOM_ELEMENT_CLASS } from './lobby-page.constants';
import { GameWizardVSOnline } from 'GAME_WIZARD';
import { ElementGenerator } from 'UI_ELEMENTS';

export class LobbyPage extends Page {
  #onlineUsersController;
  #gameWizard;
  #invitationBased = false;
  #peersUpdate;

  constructor() {
    super();
    this.init();
    this.#peersUpdate = this.onlineConnection.peers$.subscribe(this.#onOnlineUsersUpdate.bind(this));
  }

  get #peers() {
    return this.onlineConnection.peers;
  }

  renderPage(mainContainer) {
    if (this.#gameWizard) {
      mainContainer.append(this.#gameWizard.render());
      this.#gameWizard.init();
    } else {
      const section = this.#generateMainSection();
      mainContainer.append(section);
    }
  }

  #generateLinkInvitationSection() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.lintInvitationContainer]);
    const button = LinkInvitationButton.generate(this.#inviteWithLink.bind(this));
    container.append(button);
    return container;
  }

  #generateMainSection() {
    this.#onlineUsersController = new OnlineUsers(this.#onInviteUser.bind(this), this.#peers);
    const section = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.content]);
    const linkInvitation = this.#generateLinkInvitationSection();
    const onlineUsersSection = this.#onlineUsersController.render();
    section.append(linkInvitation, onlineUsersSection);
    return section;
  }

  #onOnlineUsersUpdate(onlineUsers) {
    if (this.#onlineUsersController) {
      this.#onlineUsersController.updateOnlineUsers(onlineUsers);
      return;
    }
    // TODO: opened wizard and in the meantime peer left! show a notification that this user left!
    console.log('onOnlineUsersUpdate');
    console.log(onlineUsers);
    console.log(this.#gameWizard);
    console.log(this.#invitationBased);
  }

  #inviteWithLink() {
    this.#invitationBased = false;
    this.#setGameWizard();
    this.init();
  }

  #onInviteUser(user) {
    this.#invitationBased = true;
    this.#setGameWizard(user);
    this.init();
  }

  #setGameWizard(opponent) {
    this.#gameWizard = new GameWizardVSOnline(opponent);
    this.#gameWizard.onCancel = this.#onCancelWizard.bind(this);
    this.#gameWizard.onComplete = this.#onGameSetUpComplete.bind(this);
  }

  #onCancelWizard() {
    this.#gameWizard = undefined;
    this.#invitationBased = false;
    this.init();
  }

  #onGameSetUpComplete(gameConfig) {
    gameConfig.invitationBased = this.#invitationBased;
    this.onChangePage(PageType.GamePage, gameConfig);
  }

  onChangePage(nextPage = PageType.HomePage, params) {
    this.#peersUpdate.unsubscribe();
    super.onChangePage(nextPage, params);
  }

}
