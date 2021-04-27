'use strict';
import { Page } from '../page';

export class HomePage extends Page {


  constructor() {
    super();

    console.log('HomePage');
    this.init();
  }

  renderPage(mainContainer) {
    console.log("render home page");
    console.log(mainContainer);
  }

}
