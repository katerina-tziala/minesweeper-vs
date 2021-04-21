'use strict';

import { Page } from '../page';
export class JoinPage extends Page {

  constructor() {
    super();
    console.log('JoinPage');
    //this.init();
  }

  renderPage(mainContainer) {
   console.log(mainContainer);
   console.log("render join page");
  }
}
