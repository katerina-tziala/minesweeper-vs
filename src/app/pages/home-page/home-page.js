'use strict';
import { Page } from '../page';
import { LocalStorageHelper } from 'UTILS';

export class HomePage extends Page {


  constructor() {
    super();

    //console.log('HomePage');
    this.init();
  }

  renderPage(mainContainer) {
    console.log("render -> HomePage");
    console.log(mainContainer);
    const user = LocalStorageHelper.user;
    console.log(user);
  }

}
