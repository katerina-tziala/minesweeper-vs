'use strict';
import { Page } from '../page';
import { LocalStorageHelper } from 'UTILS';
import { Menu } from './menu/menu';

export class HomePage extends Page {
  #menu;

  constructor() {
    super();
    this.#menu = new Menu();

    //console.log('HomePage');
    this.init();
  }

  renderPage(mainContainer) {
    console.log("render -> HomePage");
    console.log(mainContainer);
    const user = LocalStorageHelper.user;
    
    mainContainer.append(this.#menu.generate());
    
    console.log(user);
  }

}
