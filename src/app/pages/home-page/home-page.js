'use strict';
import { Page } from '../page';
import { enumKey } from 'UTILS';
import { GameType } from 'GAME_ENUMS';
import { HomePageMenu as Menu } from './home-page-menu';
import { PageType } from '../page-type.enum';
import * as GAME_WIZARD from 'GAME_WIZARD';
import { WIZARD_NAME } from './home-page.constants';
import { AddUsername } from '~/components/@components.module';

export class HomePage extends Page {
  #menu;
  #selectedGameType;
  #opponent;
  #contentController;

  constructor() {
    super();
    this.init();
  }

  renderPage(mainContainer) {
    if (this.#selectedGameType) {
      this.#renderSelectedOptionContent(mainContainer);
    } else {
      mainContainer.append(this.#generateMenu());
    }
  }

  #generateMenu() {
    this.#menu = new Menu();
    return this.#menu.generateMenu(this.#onMenuSelection.bind(this));
  }

  #onMenuSelection(selectedOption) {
    if (selectedOption === GameType.Online) {
      this.onChangePage(PageType.LobbyPage);
    } else {
      this.#selectedGameType = selectedOption;
      this.init();
    }
  }

  #renderSelectedOptionContent(mainContainer) {
    this.#contentController = this.#loadContentController();
    mainContainer.append(this.#contentController.render());
    this.#contentController.init();
  }

  #loadContentController() {
    if (this.#selectedGameType === GameType.Friend && !this.#opponent) {
      return this.#loadUsernameForm();
    }
    return this.#loadWizard();
  }

  #loadWizard() {
    const selectedType = enumKey(GameType, this.#selectedGameType);
    const wizardName = WIZARD_NAME[selectedType];
    const wizard = new GAME_WIZARD[wizardName](this.#opponent);
    wizard.onCancel = this.#onBackToMenu.bind(this);
    wizard.onComplete = this.#onPlayGame.bind(this);
    return wizard;
  }

  #loadUsernameForm() {
    const usernameForm = new AddUsername('addOpponent');
    usernameForm.onSubmit = this.#onAddOpponent.bind(this);
    usernameForm.onClose = this.#onBackToMenu.bind(this);
    return usernameForm;
  }

  #onBackToMenu() {
    this.#selectedGameType = undefined;
    this.#contentController = undefined;
    this.#opponent = undefined;
    this.init();
  }

  #onPlayGame(gameConfig) {
    this.onChangePage(PageType.GamePage, gameConfig);
  }

  #onAddOpponent(data) {
    const { username } = data;
    if (this.#opponentUsernameSameAsUser(username)) {
      this.#contentController.setFormError('usernameSameAsUser');
    } else {
      this.#opponent = { id: 'localfriend', username };
      this.init();
    }
  }

  #opponentUsernameSameAsUser(username) {
    const appUsername = this.appUserService.username || '';
    return username.toLowerCase() === appUsername.toLowerCase();
  }

}
