'use strict';
import { Page } from '../page';
import { LocalStorageHelper } from 'UTILS';
import { GameType } from 'GAME_ENUMS';
import { HomePageMenu as Menu } from './home-page-menu';
import { PageType } from '../page-type.enum';

export class HomePage extends Page {
  #menu;

  constructor() {
    super();
    this.init();
  }

  renderPage(mainContainer) {
    const user = LocalStorageHelper.user;
    console.log(user);
    mainContainer.append(this.#generateMenu());
  }

  #generateMenu() {
    this.#menu = new Menu();
    return this.#menu.generateMenu(this.#onMenuSelection.bind(this));
  }

  #onMenuSelection(selectedOption) {
    if (selectedOption === GameType.Online) {
      this.onChangePage(PageType.LobbyPage);
    } else {
      console.log('game set up');
      console.log(selectedOption);
    }
  }

  



}
